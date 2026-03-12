import { useState } from 'react';
import { BookOpen, Calendar, Check, ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { storage } from '../../shared/lib/storage';
import { sanitizeText } from '../../shared/lib/validation';
import { THEMES, DEFAULT_THEME_KEY } from '../../shared/constants/themes';

const TOTAL_STEPS = 3;
const ONBOARDING_PROFILE_KEY = 'onboarding:profile';
const ONBOARDING_COMPLETED_KEY = 'onboarding:completed';

const SUBJECT_OPTIONS = [
  { id: 'matematica', label: 'Matemática' },
  { id: 'portugues', label: 'Português & Redação' },
  { id: 'fisica', label: 'Física' },
  { id: 'quimica', label: 'Química' },
  { id: 'biologia', label: 'Biologia' },
  { id: 'historia', label: 'História' },
  { id: 'geografia', label: 'Geografia' },
  { id: 'filosofia', label: 'Filosofia' },
  { id: 'sociologia', label: 'Sociologia' },
  { id: 'ingles', label: 'Inglês' },
  { id: 'literatura', label: 'Literatura' },
  { id: 'artes', label: 'Artes & Cultura' },
];

export function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [themeKey, setThemeKey] = useState(DEFAULT_THEME_KEY);
  const [darkMode, setDarkMode] = useState(false);

  const theme = THEMES[themeKey] ?? THEMES[DEFAULT_THEME_KEY];

  const toggleSubject = (id) => {
    setSubjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const canAdvance = () => {
    if (step === 1) return sanitizeText(name).length > 0 && examDate !== '';
    if (step === 2) return subjects.length > 0;
    return true;
  };

  const handleComplete = () => {
    const profile = {
      name: sanitizeText(name, 80),
      examDate,
      subjects,
    };
    storage.set(ONBOARDING_PROFILE_KEY, profile);
    storage.set(ONBOARDING_COMPLETED_KEY, true);
    onComplete({ themeKey, darkMode, profile });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-stone-100">
          <div
            className={`h-1 ${theme.bg} transition-all duration-500`}
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step indicator */}
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
            Passo {step} de {TOTAL_STEPS}
          </p>

          {/* ─── Step 1: Name + Exam Date ─── */}
          {step === 1 && (
            <div>
              <BookOpen className="w-8 h-8 mb-4 text-stone-400" />
              <h2 className="text-2xl font-bold text-stone-800 mb-1">Bem-vindo ao App Study</h2>
              <p className="text-stone-500 mb-6 text-sm">Vamos configurar seu perfil em 3 passos rápidos.</p>

              <label className="block text-sm font-medium text-stone-700 mb-1">Seu nome</label>
              <input
                type="text"
                maxLength={80}
                placeholder="Como você quer ser chamado?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 mb-4"
              />

              <label className="block text-sm font-medium text-stone-700 mb-1">Data da prova</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          )}

          {/* ─── Step 2: Priority Subjects ─── */}
          {step === 2 && (
            <div>
              <Calendar className="w-8 h-8 mb-4 text-stone-400" />
              <h2 className="text-2xl font-bold text-stone-800 mb-1">Matérias prioritárias</h2>
              <p className="text-stone-500 mb-6 text-sm">Quais disciplinas você quer focar? Selecione ao menos uma.</p>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {SUBJECT_OPTIONS.map((subject) => {
                  const selected = subjects.includes(subject.id);
                  return (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                        selected
                          ? `${theme.bg} text-white border-transparent shadow-sm`
                          : 'border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          selected ? 'bg-white/20 border-white/40' : 'border-stone-300'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span>{subject.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Step 3: Theme + Dark Mode ─── */}
          {step === 3 && (
            <div>
              <Palette className="w-8 h-8 mb-4 text-stone-400" />
              <h2 className="text-2xl font-bold text-stone-800 mb-1">Personalização</h2>
              <p className="text-stone-500 mb-6 text-sm">Escolha o tema visual. Você pode mudar depois.</p>

              <div className="flex gap-4 mb-8">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeKey(t.id)}
                    title={t.name}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                      themeKey === t.id
                        ? 'border-stone-700 scale-110'
                        : 'border-transparent hover:border-stone-200'
                    }`}
                  >
                    <span className="w-9 h-9 rounded-full block shadow" style={{ backgroundColor: t.hex }} />
                    <span className="text-xs text-stone-600 font-medium">{t.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode((prev) => !prev)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${darkMode ? theme.bg : 'bg-stone-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      darkMode ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-stone-700">Ativar modo escuro</span>
              </div>
            </div>
          )}

          {/* ─── Navigation ─── */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="flex items-center gap-1 text-stone-500 hover:text-stone-800 disabled:opacity-0 transition-colors text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all ${
                  canAdvance() ? `${theme.accent}` : 'bg-stone-200 cursor-not-allowed text-stone-400'
                }`}
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white ${theme.accent}`}
              >
                Começar
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
