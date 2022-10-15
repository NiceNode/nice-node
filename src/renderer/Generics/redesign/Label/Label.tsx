import { container } from './label.css';

export interface LabelProps {
  label: string;
  /**
   * Label color
   */
  type?: 'green' | 'red' | 'gray' | 'pink' | 'purple' | 'orange' | 'pink2';
}

export const Label = ({ label, type }: LabelProps) => {
  return (
    <div className={[container, `${type}`].join(' ')}>
      <div>{label}</div>
    </div>
  );
};
