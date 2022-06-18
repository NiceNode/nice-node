import styled from 'styled-components';

export default styled.button`
  background: transparent;
  color: inherit;
  font-size: 1em;
`;

export const DopeButton = styled.button`
  color: #dd5789;
  box-shadow: 2px 5px 10px;
  box-sizing: border-box;
  padding: 2px;
  border-radius: 5px;
  width: 200px;
  height: 100px;
  margin-left: 5px;
  margin-right: 10px;
  background: linear-gradient(
    200.96deg,
    #fedc2a -29.09%,
    #dd5789 51.77%,
    #7a2c9e 129.35%
  );
  background-size: 800% 800%;
  font-size: 1em;
  animation-name: moveBackground;
  animation-duration: 6000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-direction: alternate;

  @keyframes moveBackground {
    // 0% {
    //   background-position: 0% 50%;
    // }
    // 50% {
    //   background-position: 100% 50%;
    // }
    // 100% {
    //   background-position: 0% 50%;
    // }
    0% {
      background: #7a2c9e;
    }
    50% {
      background: #dd5789;
    }
    100% {
      background: #fedc2a;
    }
  }
`;
