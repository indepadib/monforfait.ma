"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', Orange: 240, IAM: 250, Inwi: 249 },
  { month: 'Fév', Orange: 240, IAM: 250, Inwi: 249 },
  { month: 'Mar', Orange: 230, IAM: 250, Inwi: 235 },
  { month: 'Avr', Orange: 230, IAM: 240, Inwi: 230 },
  { month: 'Mai', Orange: 210, IAM: 240, Inwi: 215 }, // Prix "Cachés"
  { month: 'Juin', Orange: 200, IAM: 230, Inwi: 199 },
];

export function ObservatoireChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIAM" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInwi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" domain={[150, 300]} tickFormatter={(value) => `${value} DH`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="Orange" stroke="#f97316" fillOpacity={1} fill="url(#colorOrange)" />
                <Area type="monotone" dataKey="IAM" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIAM)" />
                <Area type="monotone" dataKey="Inwi" stroke="#a855f7" fillOpacity={1} fill="url(#colorInwi)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}
