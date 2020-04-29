import * as React from 'react';

export type MultilineTextProps = {
  lines: string[]
}

export function MultilineText({lines}: MultilineTextProps) {
  return (
    <>
      { lines.map((line, index) => <div key={index}>{line}</div>) }
    </>
  );
}
