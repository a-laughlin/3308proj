import React, { useState } from 'react';
import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import {withStyles} from './hooks';
// for more examples, see https://github.com/mpeyper/react-hooks-testing-library/tree/master/test
describe('useStateExample', () => {
  afterEach(cleanup)
  it('uses state', () => {
    const {result} = renderHook(() => useState('foo'))
    expect(result.current[0]).toBe('foo')
    act(() => result.current[1]('bar'))
    expect(result.current[0]).toBe('bar')
  })
})

describe('withStyles', () => {
  afterEach(cleanup)
  it('returns a function starting with "use"', () => {
    expect(withStyles('w100px').name).toMatch(/^use/);
  })
  it('converts strings to styles', () => {
    const fn = withStyles('w100px');
    expect(fn({})).toEqual({style:{width:'100px'}})
  })
  it('converts objects to styles', () => {
    const fn = withStyles({width:'100px'});
    expect(fn({})).toEqual({style:{width:'100px'}})
  })
  it('merges objects', () => {
    const fn = withStyles({width:'1'});
    expect(renderHook(()=>fn({style:{height:'1'}})).result.current)
    .toEqual({style:{width:'1',height:'1'}})
  })
  it('converts functions that return objects to styles', () => {
    const fn = withStyles(()=>({width:'100px'}));
    expect(fn({})).toEqual({style:{width:'100px'}})
  })
  it('converts functions that return strings to styles', () => {
    const fn = withStyles(()=>'w100px');
    expect(fn({})).toEqual({style:{width:'100px'}})
  })
  it('ignores unrecognized strings', () => {
    expect(withStyles('wwwww100px')({})).toEqual({style:{}})
  })
  it('typerrors on non-(objects|strings|functions)', () => {
    for (const item of [/foo/,null,undefined,1,[],new Map(),new Set()]){
      expect(()=>withStyles(item)({})).toThrow(TypeError);
    }
  })
})
