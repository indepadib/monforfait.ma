"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Search, Loader2, CheckCircle2 } from 'lucide-react';

// Leaflet is dynamically imported to bypass SSR issues
// We use a ref-based approach so no `react-leaflet` SSR conflicts

type NominatimResult = {
    lat: string;
    lon: string;
    display_name: string;
};

type AddressMapPickerProps = {
    onChange: (data: { address: string; lat: number; lon: number }) => void;
};

export function AddressMapPicker({ onChange }: AddressMapPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<import('leaflet').Map | null>(null);
    const markerRef = useRef<import('leaflet').Marker | null>(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [confirmed, setConfirmed] = useState<{ address: string; lat: number; lon: number } | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    // Initialise the Leaflet map only on the client, after mount
    useEffect(() => {
        let isMounted = true;

        (async () => {
            const L = await import('leaflet');

            // Fix default icon paths broken by webpack
            delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            if (!isMounted || !mapContainerRef.current || mapRef.current) return;

            const map = L.map(mapContainerRef.current, {
                center: [33.5731, -7.5898], // Default: Casablanca
                zoom: 13,
                zoomControl: true,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);

            const marker = L.marker([33.5731, -7.5898], { draggable: true }).addTo(map);

            marker.on('dragend', async () => {
                const pos = marker.getLatLng();
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json&accept-language=fr`
                );
                const data = await res.json();
                const addr = data.display_name || `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`;
                setQuery(addr);
                setConfirmed({ address: addr, lat: pos.lat, lon: pos.lng });
                onChange({ address: addr, lat: pos.lat, lon: pos.lng });
            });

            mapRef.current = map;
            markerRef.current = marker;
            setMapReady(true);
        })();

        return () => {
            isMounted = false;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const flyTo = useCallback((lat: number, lon: number, address: string) => {
        if (!mapRef.current || !markerRef.current) return;
        mapRef.current.flyTo([lat, lon], 16, { animate: true, duration: 1.2 });
        markerRef.current.setLatLng([lat, lon]);
        setConfirmed({ address, lat, lon });
        onChange({ address, lat, lon });
    }, [onChange]);

    const searchAddress = async () => {
        if (!query.trim() || query.length < 4) return;
        setIsSearching(true);
        setShowDropdown(false);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=ma&limit=5&format=json&accept-language=fr`
            );
            const data: NominatimResult[] = await res.json();
            setResults(data);
            setShowDropdown(true);
        } catch {
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const selectResult = (r: NominatimResult) => {
        const lat = parseFloat(r.lat);
        const lon = parseFloat(r.lon);
        setQuery(r.display_name);
        setShowDropdown(false);
        flyTo(lat, lon, r.display_name);
    };

    return (
        <div className="space-y-3">
            {/* Leaflet CSS injected inline once — lightweight */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />

            {/* Search Input */}
            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setShowDropdown(false); }}
                            onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
                            placeholder="Ex: Rue de la Liberté, Maarif, Casablanca"
                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white text-sm"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={searchAddress}
                        disabled={isSearching}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60 text-sm font-bold"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Chercher
                    </button>
                </div>

                {/* Dropdown suggestions */}
                {showDropdown && results.length > 0 && (
                    <ul className="absolute z-[9999] mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl overflow-hidden text-sm">
                        {results.map((r, i) => (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => selectResult(r)}
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                                >
                                    {r.display_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Map container */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-inner">
                {!mapReady && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                )}
                <div ref={mapContainerRef} style={{ height: '240px', width: '100%' }} />
                <div className="absolute bottom-2 right-2 z-[1000] bg-white dark:bg-zinc-900 text-xs px-2 py-1 rounded-lg text-zinc-500 shadow pointer-events-none">
                    Glissez le marqueur pour ajuster
                </div>
            </div>

            {/* Confirmation badge */}
            {confirmed && (
                <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-sm text-green-800 dark:text-green-300">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{confirmed.address}</span>
                </div>
            )}
        </div>
    );
}
