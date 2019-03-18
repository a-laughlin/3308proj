import { useState } from 'react';
import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import {style} from './hooks';
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

describe('style', () => {
  afterEach(cleanup)
  it('returns a function starting with "use"', () => {
    expect(style('w100px').name).toMatch(/^use/);
  })
  it('converts strings to styles', () => {
    const fn = style('w100px');
    expect(fn({})).toEqual({style:{width:'100px'}})
  })
  it('converts objects to styles', () => {
    const fn = style({width:'100px'});
    expect(fn({})).toEqual({style:{width:'100px'}})
  })
  it('merges objects', () => {
    const fn = style({width:'1'});
    expect(renderHook(()=>fn({style:{height:'1'}})).result.current)
    .toEqual({style:{width:'1',height:'1'}})
  })
  it('converts functions that return objects to styles', () => {
    const fn = style(()=>({width:'100px'}));
    expect(fn({})).toEqual({style:{width:'100px'}})
  })
  it('converts functions that return strings to styles', () => {
    const fn = style(()=>'w100px');
    expect(fn({})).toEqual({style:{width:'100px'}})
  })
  it('typerrors on non-(objects|strings|functions)', () => {
    for (const item of [/foo/,null,undefined,1,[],new Map(),new Set()]){
      expect(()=>style(item)({})).toThrow(TypeError);
    }
  })
})
