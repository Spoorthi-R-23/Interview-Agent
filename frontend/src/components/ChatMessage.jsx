import PropTypes from 'prop-types';
import clsx from 'clsx';

const senderStyles = {
  interviewer: 'bg-slate-800 text-slate-100 self-start border border-slate-700',
  candidate: 'bg-brand text-white self-end',
  system: 'bg-slate-900 text-brand-light self-center border border-brand/40'
};

function ChatMessage({ sender, content }) {
  return (
    <div
      className={clsx(
        'max-w-xl rounded-2xl px-4 py-3 text-sm shadow-lg transition',
        senderStyles[sender] || senderStyles.system
      )}
    >
      <p className="whitespace-pre-line leading-relaxed">{content}</p>
    </div>
  );
}

ChatMessage.propTypes = {
  sender: PropTypes.oneOf(['interviewer', 'candidate', 'system']).isRequired,
  content: PropTypes.string.isRequired
};

export default ChatMessage;
