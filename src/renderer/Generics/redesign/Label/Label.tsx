import { container } from './label.css';

export interface LabelProps {
  label: string;
  /**
   * Label color
   */
  type?: 'pink' | 'pink2' | 'green';
}

export const Label = ({ label, type }: LabelProps) => {
  return (
    <div className={[container, `${type}`].join(' ')}>
      <div>{label}</div>
    </div>
  );
};
