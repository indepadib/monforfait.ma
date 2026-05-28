<?php
/**
 * monforfait.ma — Voice AI Integration
 * ÉQUIVALENT PHP / LARAVEL
 *
 * Si votre backend est PHP/Laravel, utilisez ce fichier.
 * Crée les routes, jobs, et controllers nécessaires.
 *
 * Installation: composer require guzzlehttp/guzzle
 */

// ═══════════════════════════════════════════════════════════════
// routes/api.php — Ajouter ces routes
// ═══════════════════════════════════════════════════════════════
/*
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/voice/call/{leadId}',  [VoiceController::class, 'triggerCall']);
    Route::get('/voice/leads',           [VoiceController::class, 'listLeads']);
    Route::get('/voice/stats',           [VoiceController::class, 'stats']);
    Route::post('/voice/queue',          [VoiceController::class, 'addToQueue']);
});

// Webhook Vapi — PAS de middleware auth (sécurisé par signature)
Route::post('/voice/webhook', [VoiceController::class, 'webhook']);
*/


// ═══════════════════════════════════════════════════════════════
// app/Http/Controllers/VoiceController.php
// ═══════════════════════════════════════════════════════════════

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\VoiceCall;
use App\Models\VoiceBlacklist;
use App\Models\VoiceQueue;
use App\Jobs\TriggerVoiceCallJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class VoiceController extends Controller
{
    private string $vapiBaseUrl = 'https://api.vapi.ai';

    // ─── Utilitaires ──────────────────────────────────────────────

    private function normalizePhone(string $raw): ?string
    {
        $n = preg_replace('/[\s\-\.\(\)]/', '', $raw);
        if (str_starts_with($n, '+212') && strlen($n) === 13) return $n;
        if (str_starts_with($n, '212') && strlen($n) === 12)  return '+' . $n;
        if (str_starts_with($n, '0') && strlen($n) === 10)    return '+212' . substr($n, 1);
        if (strlen($n) === 9 && preg_match('/^[5-7]/', $n))   return '+212' . $n;
        return null;
    }

    private function isCallingHour(): bool
    {
        $now  = now()->setTimezone('Africa/Casablanca');
        $hour = (int) $now->format('H');
        $day  = (int) $now->format('N'); // 5 = vendredi
        if ($day === 5 && $hour >= 11 && (int) $now->format('i') >= 30) return false;
        return $hour >= 8 && $hour < 20;
    }

    private function normalizeOperator(string $raw): string
    {
        $r = strtolower($raw);
        if (str_contains($r, 'iam') || str_contains($r, 'maroc telecom')) return 'IAM';
        if (str_contains($r, 'orange') || str_contains($r, 'méditel'))    return 'Orange';
        if (str_contains($r, 'inwi') || str_contains($r, 'wana'))         return 'Inwi';
        return 'Inconnu';
    }

    private function computeRouting(string $opNorm, string $service): array
    {
        $table = [
            'IAM'     => ['cible1' => 'Inwi',   'cible2' => 'Orange Maroc'],
            'Orange'  => ['cible1' => 'Inwi',   'cible2' => 'IAM'],
            'Inwi'    => ['cible1' => 'IAM',    'cible2' => 'Orange Maroc'],
            'Inconnu' => ['cible1' => 'Tous',   'cible2' => 'N/A'],
        ];
        $valMap = ['mobile' => 'standard', 'box' => 'élevée', 'bundle' => 'premium'];
        $route  = $table[$opNorm] ?? $table['Inconnu'];
        return array_merge($route, [
            'priorite'   => in_array($opNorm, ['IAM','Orange','Inwi']) ? 'haute' : 'moyenne',
            'lead_value' => $valMap[$service] ?? 'standard',
        ]);
    }

    // ─── Déclencher un appel ──────────────────────────────────────

    public function triggerCall(Request $request, int $leadId)
    {
        $lead = Lead::findOrFail($leadId);

        if (!$lead->consent_voice)
            return response()->json(['error' => 'Pas de consentement'], 400);

        if (in_array($lead->voice_status, ['CONFIRMED','DECLINED','ABANDONED']))
            return response()->json(['error' => "Lead déjà traité ({$lead->voice_status})"], 400);

        if ($lead->voice_retry_count >= config('voice.max_retries', 3))
            return response()->json(['error' => 'Max tentatives atteint'], 400);

        $phone = $this->normalizePhone($lead->telephone);
        if (!$phone) return response()->json(['error' => 'Numéro invalide'], 400);

        if (VoiceBlacklist::where('phone_norm', $phone)->exists())
            return response()->json(['error' => 'Numéro sur liste noire'], 400);

        if (!$this->isCallingHour())
            return response()->json(['error' => 'Hors horaires (08h-20h)'], 400);

        try {
            $vapiResponse = Http::withToken(config('services.vapi.api_key'))
                ->post("{$this->vapiBaseUrl}/call/phone", [
                    'assistantId'        => config('services.vapi.assistant_id'),
                    'phoneNumberId'      => config('services.vapi.phone_number_id'),
                    'customer'           => ['number' => $phone, 'name' => $lead->prenom],
                    'assistantOverrides' => [
                        'variableValues' => ['PRENOM_LEAD' => $lead->prenom, 'LEAD_ID' => (string) $lead->id]
                    ],
                    'metadata'           => ['lead_id' => (string) $lead->id],
                ]);

            if (!$vapiResponse->successful())
                throw new \Exception($vapiResponse->body());

            $vapiCallId = $vapiResponse->json('id');

            $call = VoiceCall::create([
                'lead_id'     => $lead->id,
                'vapi_call_id'=> $vapiCallId,
                'started_at'  => now(),
            ]);

            $lead->update([
                'voice_status'      => 'CALLING',
                'voice_called_at'   => now(),
                'voice_retry_count' => $lead->voice_retry_count + 1,
            ]);

            return response()->json([
                'success'     => true,
                'vapi_call_id'=> $vapiCallId,
                'call_db_id'  => $call->id,
            ]);

        } catch (\Exception $e) {
            Log::error('[VoiceController] triggerCall error', ['message' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ─── Webhook Vapi ─────────────────────────────────────────────

    public function webhook(Request $request)
    {
        // Vérifier la signature HMAC
        $rawBody  = $request->getContent();
        $secret   = config('services.vapi.webhook_secret');
        $expected = hash_hmac('sha256', $rawBody, $secret);
        $received = $request->header('x-vapi-signature', '');

        if ($secret && !hash_equals($expected, $received)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $msg = $request->input('message', []);

        // Logger le webhook brut
        DB::table('voice_webhook_logs')->insert([
            'vapi_call_id' => $msg['call']['id'] ?? null,
            'event_type'   => $msg['type'] ?? null,
            'payload'      => json_encode($request->all()),
            'received_at'  => now(),
        ]);

        if (($msg['type'] ?? '') !== 'end-of-call-report') {
            return response()->json(['status' => 'ignored']);
        }

        try {
            $call       = $msg['call'] ?? [];
            $analysis   = $msg['analysis'] ?? [];
            $artifact   = $msg['artifact'] ?? [];
            $structured = $analysis['structuredData'] ?? [];
            $leadId     = $call['metadata']['lead_id'] ?? null;

            if (!$leadId) return response()->json(['error' => 'lead_id manquant'], 400);

            $opNorm   = $this->normalizeOperator($structured['q1_operateur_actuel'] ?? '');
            $service  = $structured['q2_service_recherche'] ?? 'non_précisé';
            $routing  = $this->computeRouting($opNorm, $service);
            $status   = $structured['status'] ?? 'ERROR';

            // Calculer la durée
            $duration = 0;
            if (!empty($call['startedAt']) && !empty($call['endedAt'])) {
                $duration = (int) (strtotime($call['endedAt']) - strtotime($call['startedAt']));
            }

            // Mettre à jour voice_calls
            VoiceCall::where('vapi_call_id', $call['id'] ?? '')->update([
                'status'               => $status,
                'first_name_confirmed' => ($structured['first_name_confirmed'] ?? false) ? 1 : 0,
                'q1_operator_raw'      => $structured['q1_operateur_actuel'] ?? null,
                'q1_operator_norm'     => $opNorm,
                'q2_service'           => $service,
                'callback_preference'  => $structured['callback_preference'] ?? null,
                'summary'              => $analysis['summary'] ?? null,
                'target_operator_1'    => $routing['cible1'],
                'target_operator_2'    => $routing['cible2'],
                'lead_value'           => $routing['lead_value'],
                'recording_url'        => $artifact['recordingUrl'] ?? null,
                'transcript_url'       => $artifact['transcriptUrl'] ?? null,
                'duration_seconds'     => $duration,
                'ended_at'             => now(),
            ]);

            // Mettre à jour le lead
            $leadUpdate = ['voice_status' => $status];

            if (in_array($status, ['VOICEMAIL','CALLBACK_REQUESTED'])) {
                $leadUpdate['voice_next_retry'] = now()->addHours(4);
            }

            Lead::where('id', $leadId)->update($leadUpdate);

            // Ajouter à la liste noire si DECLINED
            if ($status === 'DECLINED' && !empty($call['customer']['number'])) {
                $phone = $this->normalizePhone($call['customer']['number']);
                if ($phone) {
                    VoiceBlacklist::firstOrCreate(
                        ['phone_norm' => $phone],
                        ['reason' => 'DECLINED auto', 'added_by' => 'auto']
                    );
                }
            }

            Log::info("[webhook] Lead {$leadId} → {$status} | {$opNorm} | {$service}");
            return response()->json(['status' => 'ok', 'lead_id' => $leadId]);

        } catch (\Exception $e) {
            Log::error('[webhook] Error', ['message' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ─── Stats dashboard ──────────────────────────────────────────

    public function stats(Request $request)
    {
        $from = $request->get('date_from', now()->subDays(30)->toDateString());
        $to   = $request->get('date_to',   now()->toDateString());

        $stats = DB::selectOne("
            SELECT
                COUNT(*)                                    AS total_calls,
                SUM(status = 'CONFIRMED')                   AS confirmed,
                SUM(status = 'INVALID')                     AS invalid,
                SUM(status = 'VOICEMAIL')                   AS voicemail,
                SUM(status = 'CALLBACK_REQUESTED')          AS callbacks,
                SUM(status = 'DECLINED')                    AS declined,
                ROUND(AVG(duration_seconds))                AS avg_duration,
                SUM(status='CONFIRMED')/COUNT(*)*100        AS confirmed_rate,
                SUM(lead_value='premium')                   AS premium_leads
            FROM voice_calls
            WHERE created_at BETWEEN ? AND ?
        ", [$from . ' 00:00:00', $to . ' 23:59:59']);

        return response()->json(['stats' => $stats, 'period' => compact('from','to')]);
    }

    // ─── Ajouter à la file d'appels ───────────────────────────────

    public function addToQueue(Request $request)
    {
        $leadId = $request->input('lead_id');
        if (!$leadId) return response()->json(['error' => 'lead_id requis'], 400);

        DB::table('voice_queue')->insertOrIgnore([
            'lead_id'      => $leadId,
            'priority'     => 5,
            'scheduled_at' => now(),
            'created_at'   => now(),
        ]);

        return response()->json(['status' => 'queued', 'lead_id' => $leadId]);
    }
}


// ═══════════════════════════════════════════════════════════════
// app/Jobs/TriggerVoiceCallJob.php — Worker async (Laravel Queue)
// ═══════════════════════════════════════════════════════════════
/*
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Http\Controllers\VoiceController;
use Illuminate\Http\Request;

class TriggerVoiceCallJob implements ShouldQueue
{
    use Dispatchable, Queueable;
    public int $tries = 3;
    public int $backoff = 300; // 5 min entre tentatives

    public function __construct(public int $leadId) {}

    public function handle(): void
    {
        $controller = new VoiceController();
        $fakeRequest = new Request(['lead_id' => $this->leadId]);
        $controller->triggerCall($fakeRequest, $this->leadId);
    }
}
*/


// ═══════════════════════════════════════════════════════════════
// config/services.php — Ajouter la section Vapi
// ═══════════════════════════════════════════════════════════════
/*
'vapi' => [
    'api_key'         => env('VAPI_API_KEY'),
    'assistant_id'    => env('VAPI_ASSISTANT_ID'),
    'phone_number_id' => env('VAPI_PHONE_NUMBER_ID'),
    'webhook_secret'  => env('VAPI_WEBHOOK_SECRET'),
],

'voice' => [
    'max_retries'         => env('MAX_RETRIES', 3),
    'retry_delay_hours'   => env('RETRY_DELAY_HOURS', 4),
    'call_hour_start'     => env('CALL_HOUR_START', 8),
    'call_hour_end'       => env('CALL_HOUR_END', 20),
],
*/
