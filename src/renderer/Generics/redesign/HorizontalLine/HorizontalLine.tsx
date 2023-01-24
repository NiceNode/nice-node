import { container } from './horizontalLine.css';

export interface HorizontalLineProps {
  type?: 'content' | 'menu' | 'above-tab';
}

export const HorizontalLine = ({ type }: HorizontalLineProps) => {
  return <div className={[container, `${type}`].join(' ')} />;
};
