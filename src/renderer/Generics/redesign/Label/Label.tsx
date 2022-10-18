import { container } from './label.css';

export interface LabelProps {
  label: string;
  /**
   * Label color
   */
  type?: 'green' | 'red' | 'gray' | 'pink' | 'purple' | 'orange' | 'pink2';
  /**
   * Label size TODO: better way?
   */
  size?: null | 'small';
}

export const Label = ({ label, type, size }: LabelProps) => {
  const sizing = size || '';
  return (
    <div className={[container, `${sizing}`, `${type}`].join(' ')}>
      <div>{label}</div>
    </div>
  );
};
