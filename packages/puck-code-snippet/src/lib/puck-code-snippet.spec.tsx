import { render } from '@testing-library/react';

import PuckCodeSnippet from './puck-code-snippet';

describe('PuckCodeSnippet', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<PuckCodeSnippet />);
    expect(baseElement).toBeTruthy();
  });
  
});
