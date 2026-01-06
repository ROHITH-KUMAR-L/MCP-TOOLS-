'use client';

import React from 'react';
import styled from 'styled-components';

const Loader = () => {
    return (
        <PageWrapper>
            <LoaderContainer>
                <Digit $delay="0.1s">0</Digit>
                <Digit $delay="0.3s">1</Digit>
                <Digit $delay="0.5s">0</Digit>
                <Digit $delay="0.7s">1</Digit>
                <Digit $delay="0.9s">1</Digit>
                <Digit $delay="0.9s">0</Digit>
                <Digit $delay="1.1s">0</Digit>
                <Digit $delay="1.3s">1</Digit>
                <Glow />
            </LoaderContainer>
        </PageWrapper>
    );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const LoaderContainer = styled.div`
  width: 120px;
  height: 160px;
  margin: 0 auto;
  position: relative;
  perspective: 800px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
`;

const Digit = styled.div`
  color: #ffffff;
  font-family: monospace;
  font-size: 18px;
  text-align: center;
  text-shadow: 0 0 5px #ffffff;
  animation:
    matrix-fall 2s infinite,
    matrix-flicker 0.5s infinite;
  animation-delay: ${props => props.$delay || '0s'};
  opacity: 0;

  @keyframes matrix-fall {
    0% {
      transform: translateY(-50px) rotateX(90deg);
      opacity: 0;
    }
    20%,
    80% {
      transform: translateY(0) rotateX(0deg);
      opacity: 0.8;
    }
    100% {
      transform: translateY(50px) rotateX(-90deg);
      opacity: 0;
    }
  }

  @keyframes matrix-flicker {
    0%,
    19%,
    21%,
    100% {
      opacity: 0.8;
    }
    20% {
      opacity: 0.2;
    }
  }
`;

const Glow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle,
    rgba(200, 200, 200, 0.1) 0%,
    transparent 70%
  );
  animation: matrix-pulse 2s infinite;

  @keyframes matrix-pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

export default Loader;
