import { useSelector } from 'react-redux';

import { MessageSquare, Terminal, Sparkles, Zap } from 'lucide-react';

const FEATURES = [
  { title: 'DSA Visualizers', desc: 'Interactive animations for arrays, trees, and graphs with step controls.', icon: Terminal, accent: 'from-emerald-500 to-teal-500' },
  { title: 'AI Doubt Solver', desc: 'Context-aware hints, complexity notes, and debug guidance.', icon: MessageSquare, accent: 'from-indigo-500 to-sky-500' },
  { title: 'Practice by Levels', desc: 'Topic ladders & difficulty filters', icon: Sparkles, accent: 'from-amber-500 to-orange-500' },
  { title: 'Code + Test', desc: 'Built-in editor, test cases, and instant feedback.', icon: Zap, accent: 'from-rose-500 to-fuchsia-500' },
];

export default function Section2() {

  const isDark = useSelector((state)=>state?.isDark?.isDark);

  return (
    <section className={`w-full ${isDark?'bg-gray-900':''}`}>
      <div className={`${isDark?'bg-gray-900':''} mx-auto max-w-6xl px-4 py-12`}>
        {/* Header */}
        <div className={`${isDark?'bg-gray-900':''} text-center`}>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">What’s inside</h2>
          <p className="mt-2 text-sm lg:text-2xl text-gray-600 dark:text-gray-900">
            Visualize, practice, and get AI help—right where it’s needed.
          </p>
        </div>

        {/* Grid: 1 / 2 / 4 */}
        <div className={`${isDark?'bg-gray-900':''} mt-10 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4`}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className={`group ${isDark?'bg-gray-900':''} rounded-xl border border-gray-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                {/* Accent line */}
                <div className={`mb-4 h-1 w-full rounded bg-gradient-to-r ${f.accent} opacity-80`} />

                {/* Icon + text */}
                <div className={`flex ${isDark?'bg-gray-900':''} items-start gap-3`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className={`text-base ${isDark?'text-white':''} font-medium text-gray-900`}>{f.title}</h3>
                    <p className={`mt-1 ${isDark?'text-white':''}  text-sm text-gray-900`}>{f.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
