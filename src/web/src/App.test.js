import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {render, cleanup} from 'react-testing-library';
import data from './sample_data/ml_output_foo.json';

// More examples at https://github.com/kentcdodds/react-testing-library/tree/master/examples/__tests__
// Note that these should be integration tests (testing important components combinations).
// Individual components should not need testing if we follow the pattern of only returning one
// element per component.

describe("App", () => {
  afterEach(cleanup)
  it('contains text representation of ML output data', () => {
    const {container} = render(<App/>);
    expect(container.textContent).toContain(JSON.stringify(data));
  });
});
