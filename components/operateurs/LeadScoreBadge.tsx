import React from 'react';
import { LeadTemperature } from '@/types/lead';
import { Flame, ThermometerSun, Snowflake } from 'lucide-react';

interface LeadScoreBadgeProps {
  score: number;
  temperature: LeadTemperature;
}

export function LeadScoreBadge({ score, temperature }: LeadScoreBadgeProps) {
  let badgeClasses = '';
  let Icon = null;
  let text = '';

  switch (temperature) {
    case 'hot':
      badgeClasses = 'bg-red-50 text-red-700 border-red-200';
      Icon = Flame;
      text = 'Chaud';
      break;
    case 'warm':
      badgeClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      Icon = ThermometerSun;
      text = 'Tiède';
      break;
    case 'cold':
      badgeClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      Icon = Snowflake;
      text = 'Froid';
      break;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badgeClasses}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{score}</span>
      <span className="opacity-70 font-normal border-l border-current pl-1.5 ml-0.5">{text}</span>
    </div>
  );
}
