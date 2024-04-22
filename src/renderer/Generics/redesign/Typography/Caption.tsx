import type React from 'react';
import { captionTextClass } from './caption.css';

export interface CaptionProps {
  children?: React.ReactNode;
  text?: React.ReactNode | string;
  type?: string;
  // todo: display block or inline?
}

const Caption = ({ text, children, type }: CaptionProps) => {
  return (
    <div className={[captionTextClass, type].join(' ')}>{children ?? text}</div>
  );
};

export default Caption;
