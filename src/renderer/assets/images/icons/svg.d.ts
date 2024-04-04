declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  const src: string;
  export default src;
}
