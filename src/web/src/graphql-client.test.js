import React from 'react';
import ReactDOM from 'react-dom';
// import {App,SvgMain} from './App';
import {act} from 'react-testing-library';
import { useState } from 'react';
import { renderHook } from 'react-hooks-testing-library';
import { useHeartRateQuery,uri,client,gql } from './graphql-client';
// describe('useStateExample', () => {
//   it('uses state', () => {
//     // const {result,unmount,waitForNextUpdate} = renderHook(() => useState('foo'));
//     const {result,waitForNextUpdate,unmount} = renderHook(() => useState('foo'));
//     expect(result.current[0]).toBe('foo')
//     act(() => result.current[1]('bar'))
//     expect(result.current[0]).toBe('bar')
//     // obj.unmount(); // only necessary with useffect
//   })
// });

// current (any) - the return value of the callback function
// error (Error) - the error that was thrown if the callback function threw an error during rendering
// waitForNextUpdate (function) - returns a Promise that resolves the next time the hook renders, commonly when state is updated as the result of a asynchronous action.
// rerender (function([newProps])) - function to rerender the test component including any hooks called in the callback function. If newProps are passed, the will replace the initialProps passed the the callback function for future renders.
// unmount (function()) - function to unmount the test component, commonly used to trigger cleanup effects for useEffect hooks.
describe('useHeartRateQuery hook', () => {
  it('renders correct data', async () => {

    const {waitForNextUpdate,result,unmount} = renderHook(()=>
      useHeartRateQuery({summary_date:"2018-11-06",steps:20})({}));
    expect(result.current.loading).toBe(true);
    await act(waitForNextUpdate)
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toMatchSnapshot();
    unmount();
  });
  // need error test now that tests are working
});
