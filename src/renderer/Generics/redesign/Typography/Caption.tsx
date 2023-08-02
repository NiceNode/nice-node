import React from 'react';
import { captionTextClass } from './caption.css';

export interface CaptionProps {
  children?: React.ReactNode;
  text?: React.ReactNode | string;
  // todo: display block or inline?
}

const Caption = ({ text, children }: CaptionProps) => {
  return <div className={captionTextClass}>{children ?? text}</div>;
};

export default Caption;
