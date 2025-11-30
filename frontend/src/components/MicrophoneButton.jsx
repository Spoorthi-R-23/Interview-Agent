import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

function MicrophoneButton({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `response-${Date.now()}.webm`, { type: 'audio/webm' });
        onRecordingComplete(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied', error);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        isRecording ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
      }`}
    >
      {isRecording ? 'Stop Recording' : 'Answer with Voice'}
    </button>
  );
}

MicrophoneButton.propTypes = {
  onRecordingComplete: PropTypes.func.isRequired
};

export default MicrophoneButton;
