import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, Typography, IconButton, Paper, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

function VoiceInput({ setSearchText }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleMicClick = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });
    setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 10000); // auto-stop after 10 seconds
  };

  useEffect(() => {
    if (!listening && transcript) {
      setSearchText(transcript);
    }
  }, [listening, transcript, setSearchText]);

  if (!browserSupportsSpeechRecognition) {
    return <Typography color="error">🚫 Browser does not support speech recognition.</Typography>;
  }

  return (
    <Box>
      <Tooltip title="Click to speak" arrow>
        <IconButton
          onClick={handleMicClick}
          color={listening ? 'error' : 'primary'}
          sx={{ bgcolor: listening ? '#ffeaea' : '#e3f2fd' }}
        >
          <MicIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default VoiceInput;
