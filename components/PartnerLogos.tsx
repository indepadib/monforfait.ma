"use client";

import { ShieldCheck } from 'lucide-react';

const partners = [
    { name: 'Maroc Telecom', logo: 'IAM', color: 'text-blue-600' },
    { name: 'Orange', logo: 'Orange', color: 'text-orange-500' },
    { name: 'Inwi', logo: 'inwi', color: 'text-purple-600' },
];

export function PartnerLogos() {
    return (
        <section className="py-12 bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:justify-between">
                    <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-xs">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        Partenaires Officiels
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {partners.map((partner) => (
                            <div key={partner.name} className={`text-2xl md:text-3xl font-black ${partner.color} tracking-tighter`}>
                                {partner.logo}
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:block text-zinc-400 text-sm font-medium italic">
                        "Les meilleures offres directes, sans surcoût."
                    </div>
                </div>
            </div>
        </section>
    );
}
