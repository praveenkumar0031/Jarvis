// client/src/components/ResponsePanel.js
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  width: 80%;
  max-width: 800px;
  min-height: 200px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #0084ff;
  border-radius: 8px;
  padding: 1rem;
  margin: 2rem 0;
  color: #fff;
  overflow: auto;
`;

const TranscriptBox = styled.div`
  background-color: rgba(0, 132, 255, 0.1);
  border-left: 3px solid #0084ff;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0 4px 4px 0;
`;

const ResponseBox = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 3px solid #ffffff;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0 4px 4px 0;
`;

const Status = styled.div`
  color: ${props => props.isListening ? '#0084ff' : '#888'};
  font-style: italic;
  margin-top: 1rem;
`;

const Title = styled.h3`
  color: #0084ff;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const ResponsePanel = ({ transcript, responses, isListening }) => {
  const panelRef = useRef();

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [transcript, responses]);

  return (
    <Panel ref={panelRef}>
      <Title>Interaction</Title>
      
      {transcript && (
        <TranscriptBox>
          <strong>You:</strong> {transcript}
        </TranscriptBox>
      )}
      
      {responses.map((response, index) => (
        <ResponseBox key={index}>
          <strong>JARVIS:</strong> {response.answer}
        </ResponseBox>
      ))}
      
      <Status isListening={isListening}>
        {isListening ? 'Listening...' : 'Waiting for command...'}
      </Status>
    </Panel>
  );
};

export default ResponsePanel;
