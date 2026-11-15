import {assertEquals} from 'jsr:@std/assert@1'
import {normalizeMoroccanPhone,publicProgressLabel,isTerminalStatus,mayAdvanceCommercialStage} from './rules.ts'

Deno.test('normalize Moroccan mobile and fixed phone numbers',()=>{
 assertEquals(normalizeMoroccanPhone('06 12 34 56 78'),'0612345678')
 assertEquals(normalizeMoroccanPhone('+212 7 12 34 56 78'),'0712345678')
 assertEquals(normalizeMoroccanPhone('00212 5 22 33 44 55'),'0522334455')
 assertEquals(normalizeMoroccanPhone('12345'),null)
 assertEquals(normalizeMoroccanPhone('06123456789'),null)
 assertEquals(normalizeMoroccanPhone(''),null)
})
Deno.test('public request status never exposes internal record details',()=>{
 assertEquals(publicProgressLabel('unreviewed'),'Demande reçue')
 assertEquals(publicProgressLabel('partner_proposed'),'Étude de mise en relation')
 assertEquals(publicProgressLabel('unknown'),'Demande reçue')
 assertEquals(isTerminalStatus('lost'),true)
 assertEquals(isTerminalStatus('qualified'),false)
})
Deno.test('commercial stage transitions do not skip invoicing',()=>{
 assertEquals(mayAdvanceCommercialStage('proposed','paid'),false)
 assertEquals(mayAdvanceCommercialStage('proposed','accepted'),true)
 assertEquals(mayAdvanceCommercialStage('invoiced','paid'),true)
 assertEquals(mayAdvanceCommercialStage('paid','proposed'),false)
})
