import { container } from './verticalLine.css';

export interface VerticalLineProps {
  type?: 'content';
}

const VerticalLine = ({ type }: VerticalLineProps) => {
  return <div className={[container, `${type}`].join(' ')} />;
};
export default VerticalLine;
