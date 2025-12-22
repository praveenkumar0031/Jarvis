// client/src/components/JarvisUI.js
import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// Define keyframes with keyframes helper
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Use animation with css helper
const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 2px solid #52ad69ff;
  animation: ${props => props.direction === 'reverse' ? 
    css`${rotate} 20s linear infinite reverse` : 
    css`${rotate} 20s linear infinite`};
`;

const OuterCircle = styled(Circle)`
  width: 280px;
  height: 280px;
  opacity: ${props => props.isActive ? 0.8 : 0.4};
`;

const MiddleCircle = styled(Circle)`
  width: 200px;
  height: 200px;
  opacity: ${props => props.isActive ? 0.9 : 0.5};
`;

const InnerCircle = styled(Circle)`
  width: 120px;
  height: 120px;
  background-color: rgba(0, 132, 255, 0.2);
  opacity: ${props => props.isActive ? 1 : 0.6};
`;

const Core = styled.div`
  width: 60px;
  height: 60px;
  background-color: #52ad69ff;
  border-radius: 50%;
  animation: ${props => props.isActive ? 
    css`${pulse} 1.5s infinite ease-in-out` : 'none'};
  box-shadow: 0 0 20px #ad7f52ff;
`;

const JarvisUI = ({ isActive }) => {
  return (
    <Container>
      <OuterCircle isActive={isActive} />
      <MiddleCircle isActive={isActive} direction="reverse" />
      <InnerCircle isActive={isActive} />
      <Core isActive={isActive} />
    </Container>
  );
};

export default JarvisUI;
