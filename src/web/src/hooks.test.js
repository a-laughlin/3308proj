import React, { useState } from 'react';
import { renderHook, cleanup, act } from 'react-hooks-testing-library'

// for more examples, see https://github.com/mpeyper/react-hooks-testing-library/tree/master/test
describe('custom hook tests', () => {
  afterEach(cleanup)

  it('uses state', () => {
    const {result} = renderHook(() => useState('foo'))
    expect(result.current[0]).toBe('foo')
    act(() => result.current[1]('bar'))
    expect(result.current[0]).toBe('bar')
  })
})
