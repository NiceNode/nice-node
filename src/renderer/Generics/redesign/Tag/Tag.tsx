import { container } from './tag.css';

export interface TagProps {
  label: string;
  /**
   * Tag color
   */
  type?: 'pink' | 'pink2' | 'green';
}

const Tag = ({ label, type }: TagProps) => {
  return (
    <div className={[container, `${type}`].join(' ')}>
      <div>{label}</div>
    </div>
  );
};

export default Tag;
