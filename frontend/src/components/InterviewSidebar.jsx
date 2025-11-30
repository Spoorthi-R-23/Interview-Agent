import PropTypes from 'prop-types';

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

function InterviewSidebar({ score, maxScore, difficulty, summary }) {
  return (
    <aside className="flex h-full flex-col gap-4">
      <MetricCard label="Score" value={`${score} / ${maxScore || 1}`} />
      <MetricCard label="Difficulty" value={difficulty} />
      <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Live Summary</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">
          {summary || 'Complete more questions to generate a summary.'}
        </p>
      </div>
    </aside>
  );
}

InterviewSidebar.propTypes = {
  score: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  summary: PropTypes.string
};

export default InterviewSidebar;
