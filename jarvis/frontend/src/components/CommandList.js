// client/src/components/CommandList.js
import React from 'react';
import styled from 'styled-components';

const CommandsContainer = styled.div`
  width: 80%;
  max-width: 800px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #0084ff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  color: #0084ff;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const CommandGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const CommandCard = styled.div`
  background-color: rgba(0, 132, 255, 0.1);
  border: 1px solid #0084ff;
  border-radius: 4px;
  padding: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 132, 255, 0.3);
  }
`;

const CommandName = styled.h4`
  color: #0084ff;
  margin: 0 0 0.5rem 0;
`;

const CommandDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 0;
`;

const CommandList = ({ commands }) => {
  return (
    <CommandsContainer>
      <Title>Available Commands</Title>
      
      {commands.length === 0 ? (
        <p>No commands available. Try adding some!</p>
      ) : (
        <CommandGrid>
          {commands.map(command => (
            <CommandCard key={command._id}>
              <CommandName>{command.name}</CommandName>
              <CommandDescription>{command.description}</CommandDescription>
            </CommandCard>
          ))}
        </CommandGrid>
      )}
    </CommandsContainer>
  );
};

export default CommandList;
