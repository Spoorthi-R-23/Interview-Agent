const features = [
  {
    title: 'Adaptive Interviewing',
    description: 'Gemini AI-driven interviewer that adjusts question difficulty and tone based on your responses.'
  },
  {
    title: 'Real-Time Feedback',
    description: 'Text-based interview interface with instant coaching feedback and detailed evaluations.'
  },
  {
    title: 'Actionable Insights',
    description: 'Real-time scoring, strengths tracker, and comprehensive interview summaries.'
  }
];

const steps = [
  'Schedule a mock interview synced to Google Calendar.',
  'Choose HR, Technical, or Behavioral focus with adaptive difficulty.',
  'Practice in real time, receive coaching, and download a tailored improvement plan.'
];

function LandingPage() {
  return (
    <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-sm font-medium text-brand-light">
              AI Interview Coach · Powered by Gemini
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              Elevate Every Interview with a Real-Time AI Coach
            </h1>
            <p className="text-lg text-slate-300">
              Train with an interviewer that never sleeps. Our AI agent analyzes every reply, adapts instantly, and
              prepares you for the questions that matter.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/interview"
                className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
              >
                Start a Mock Interview
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand hover:text-brand"
              >
                Explore Dashboard
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-brand/20 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Why candidates love Interview Agent</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-300">
              {features.map((feature) => (
                <li key={feature.title} className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4">
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="mt-1 text-slate-400">{feature.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold text-white">A tailored workflow for every round</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Refine soft skills in HR conversations, drill down on technical fundamentals, or practice behavioral STAR
              responses. The agent adapts instantly so you experience realistic pressure while still receiving supportive
              coaching.
            </p>
          </div>
          <ol className="space-y-6 text-sm text-slate-300">
            {steps.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-base font-semibold text-brand">
                  {index + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
