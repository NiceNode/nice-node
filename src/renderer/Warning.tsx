import { ImWarning } from 'react-icons/im';
import styled from 'styled-components';

const Container = styled.div`
  background: rgb(255, 255, 204);
  color: #333333;
  display: flex;
  flex-direction: row;
`;

type Props = {
  children: React.ReactNode;
};

const Warning = ({ children }: Props) => {
  return (
    <Container>
      <span style={{ padding: 5 }}>
        <ImWarning />
      </span>
      {children}
    </Container>
  );
};

export default Warning;
