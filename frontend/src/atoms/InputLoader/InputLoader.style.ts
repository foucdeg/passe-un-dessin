/* stylelint-disable selector-max-type */
import styled from 'styled-components';

export const OuterLoader = styled.div`
  width: 24px;
  height: 24px;
  display: inline-block;
  overflow: hidden;
  background: none;
`;

export const InnerLoader = styled.div`
  @keyframes ldio-j6l2lofzo7 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }

  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(0.24);
  backface-visibility: hidden;
  transform-origin: 0 0;

  div {
    box-sizing: content-box;
  }

  & > div > div {
    position: absolute;
    border-radius: 50%;
  }

  & > div > div:nth-child(1) {
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background: #f68d4f;
  }

  & > div > div:nth-child(2) {
    top: 7px;
    left: 35px;
    width: 30px;
    height: 30px;
    background: #ffd54f;
    animation: ldio-j6l2lofzo7 1s linear infinite;
    transform-origin: 15px 43px;
  }
`;
