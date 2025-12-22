// client/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { recordAudio, stopRecording } from './services/audioService';
import JarvisUI from './components/JarvisUI';
import ResponsePanel from './components/ResponsePanel';
import CommandList from './components/CommandList';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #66d3dfff;
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

const Button = styled.button`
  background-color: ${props => props.active ? '#66d3dfff' : '#333'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#66d3dfff' : '#444'};
    transform: scale(1.05);
  }
`;

function App() {
  const [responses, setResponses] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [commands, setCommands] = useState([]);
  const socketRef = useRef();
  const audioRecorderRef = useRef(null);
  
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io('http://localhost:5000');
    
    // Fetch commands from API
    fetchCommands();

    socketRef.current.on('response', (data) => {
      setResponses(prev => [...prev, data]);
      
      // Use speech synthesis to speak the response
      const speech = new SpeechSynthesisUtterance(data.answer);
      speech.rate = 1;
      speech.pitch = 1;
      speech.volume = 1;
      window.speechSynthesis.speak(speech);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchCommands = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/commands');
      const data = await response.json();
      setCommands(data);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
  };

  const toggleListening = async () => {
    if (!isListening) {
      setIsListening(true);
      SpeechRecognition.startListening({ continuous: true });
      
      try {
        audioRecorderRef.current = await recordAudio();
        audioRecorderRef.current.start();
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      setIsListening(false);
      SpeechRecognition.stopListening();
      
      try {
        if (audioRecorderRef.current) {
          const audioData = await audioRecorderRef.current.stop();
          
          // Send audio to the server
          socketRef.current.emit('speech', audioData);
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      
      resetTranscript();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <AppContainer>Your browser doesn't support speech recognition.</AppContainer>;
  }

  return (
    <AppContainer>
      <Title>J.A.R.V.I.S.</Title>
      <JarvisUI isActive={isListening} />
      
      <ControlPanel>
        <Button 
          active={isListening} 
          onClick={toggleListening}
        >
          {isListening ? 'Stop' : 'Start'}
        </Button>
      </ControlPanel>
      
      <ResponsePanel 
        transcript={transcript} 
        responses={responses} 
        isListening={isListening} 
      />
      
      <CommandList commands={commands} />
    </AppContainer>
  );
}

export default App;
