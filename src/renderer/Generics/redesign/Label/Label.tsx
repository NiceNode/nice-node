import { container } from './label.css';

export type LabelColor =
  | 'green'
  | 'red'
  | 'gray'
  | 'pink'
  | 'purple'
  | 'orange'
  | 'pink2';
export interface LabelProps {
  label: string;
  /**
   * Label color
   */
  type?: LabelColor;
  /**
   * Label size TODO: better way?
   */
  size?: null | 'small';
  /**
   * Bold text?
   */
  bold?: boolean;
}

export const Label = ({ label, type, size, bold = true }: LabelProps) => {
  const sizing = size || '';
  const boldText = bold ? 'bold' : '';
  return (
    <div
      className={[container, `${sizing}`, `${type}`, `${boldText}`].join(' ')}
    >
      <div>{label}</div>
    </div>
  );
};
