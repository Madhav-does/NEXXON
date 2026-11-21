import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'nc-chat-ui-app-provider': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties },
        HTMLElement
      >;
    }
  }
}
