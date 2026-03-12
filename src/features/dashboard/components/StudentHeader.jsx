import { useEffect, useState } from 'react';
import { storage } from '../../../shared/lib/storage';
import { ONBOARDING_PROFILE_KEY, SUBJECT_LABELS } from '../constants';

/**
 * Student profile strip — reads data saved by OnboardingWizard.
 * Displays name, days to exam, and priority subjects.
 */
export function StudentHeader({ theme }) {
  const profile = storage.get(ONBOARDING_PROFILE_KEY, null, (v, fb) =>
    v && typeof v === 'object' ? v : fb,
  );

  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    if (!profile?.examDate) return;
    const ms = new Date(profile.examDate).getTime() - Date.now();
    setDaysLeft(Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24))));
  }, [profile?.examDate]);

  if (!profile) return null;

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-0.5">
            Olá,
          </p>
          <h2 className="text-3xl font-light text-stone-800 tracking-tight">
            {profile.name || 'Estudante'}
          </h2>
        </div>

        {daysLeft !== null && (
          <div className="text-right shrink-0">
            <p className={`text-4xl font-light ${theme.text} tabular-nums`}>{daysLeft}</p>
            <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">
              dias restantes
            </p>
          </div>
        )}
      </div>

      {Array.isArray(profile.subjects) && profile.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {profile.subjects.map((s) => (
            <span
              key={s}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest ${theme.bgLight} ${theme.text}`}
            >
              {SUBJECT_LABELS[s] ?? s}
            </span>
          ))}
        </div>
      )}

      <div className="h-px bg-stone-100 mt-6" />
    </div>
  );
}
