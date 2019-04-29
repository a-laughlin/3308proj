import React from 'react';
import ReactDOM from 'react-dom';
import {DataMain} from './App';
import {render, cleanup,act,wait,waitForElement,waitForDomChange} from 'react-testing-library';

// More examples at https://github.com/kentcdodds/react-testing-library/tree/master/examples/__tests__
// Note that these should be integration tests (testing important components combinations).
// Individual components should not need testing if we follow the pattern of only returning one
// element per component.
describe("DataMain", () => {
  afterEach(cleanup)
  it('renders expected loading and success states', async () => {
    const  {container,unmount} = render(<DataMain />);
    expect(container.textContent).toContain('Loading');
    await waitForElement(()=>container.getElementsByTagName('svg')[0]);
    expect(container.getElementsByTagName('svg').length).toBeGreaterThan(0);
    unmount();
  });
});
