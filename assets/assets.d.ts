type Styles = Record<string, string>;

declare module '*.svg' {
  import React from 'react';
  const content: React.FC<React.SVGProps<SVGElement>>
  export default content
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: Styles;
  export default content;
}

declare module '*.sass' {
  const content: Styles;
  export default content;
}

declare module '*.css' {
  const content: Styles;
  export default content;
}
