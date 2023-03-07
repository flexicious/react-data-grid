import styled, { keyframes } from "styled-components";
import React from "react";
const bounce = keyframes`
  0%, 100% {
    transform: scale(0);
  } 50% {
    transform: scale(1);
  }
`;

const SpinnerContainer = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  margin: 100px auto;
`;

const SpinnerBounce = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: 0.1;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${bounce} 1.4s infinite ease-in-out both;
`;

const SpinnerBounce1 = styled(SpinnerBounce)`
  animation-delay: -0.32s;
`;

const SpinnerBounce2 = styled(SpinnerBounce)`
  animation-delay: -0.16s;
`;
export const Spinner = () => {
    return (
        <SpinnerContainer>
            <SpinnerBounce />
            <SpinnerBounce1 />
            <SpinnerBounce2 />
        </SpinnerContainer>
    );
};

