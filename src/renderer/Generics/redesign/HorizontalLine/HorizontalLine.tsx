import { container } from './horizontalLine.css';

export interface HorizontalLineProps {
  type?: 'content' | 'menu';
}

export const HorizontalLine = ({ type }: HorizontalLineProps) => {
  return <div className={[container, `${type}`].join(' ')} />;
};
