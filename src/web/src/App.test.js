import React from 'react';
import ReactDOM from 'react-dom';
// import {App,SvgMain} from './App';
import {render, cleanup,act,waitForElement} from 'react-testing-library';


// More examples at https://github.com/kentcdodds/react-testing-library/tree/master/examples/__tests__
// Note that these should be integration tests (testing important components combinations).
// Individual components should not need testing if we follow the pattern of only returning one
// element per component.

describe("SvgMain", () => {
  afterEach(cleanup);
  it('contains text representation of ML output data', () => {
    // waiting on https://github.com/facebook/react/pull/14853
    // to reenable these tests
    // let result;
    // act(()=>{
    //   const result = render(<SvgMain />);
    // })
    // expect(result.container.textContent).toContain(JSON.stringify(data))
  });
});
