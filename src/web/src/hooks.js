/* eslint-disable no-unused-vars */

import React,{useState, useEffect,Children,isElement,createElement} from 'react';
import {ma,cond,isFunction,isString,isPlainObject,stubTrue,pipe,oo,ensureArray,identity,ife,last,
        isArray,pget,over,plog,spread,rest,acceptArrayOrArgs,ensureFunction,ro,get,noop,merge} from './utils'
import {curryN,concat,flatten,capitalize} from 'lodash/fp'
import {styleStringToObj} from './style-string-to-obj'

export const toHookComposer = (component)=>(...hooks)=>function hookComposer (...props){
  if(!isPlainObject(props[0])) return toHookComposer(component)(...hooks,...props);
  return createElement(component, pipe(...hooks.map(ife(isString,s=>children(s))))(...props));
}
export const isHookComposer = fn=>fn.name==='hookComposer';
export const ensureHookComposer = ife(isHookComposer,identity,toHookComposer);

export const [Div,Span,Ul,Ol,Dt,Dd,Dl,Article,P,H1,H2,H3,H4,H5,H6,Li,Input,A,Label,Pre,Textarea] = (
             'div,span,ul,ol,dt,dd,dl,article,p,h1,h2,h3,h4,h5,h6,li,input,a,label,pre,textarea'
             .split(',').map(toHookComposer));
export const [Button,Img,Header,Svg,G,Path,Rect,Line,Circle,Text,Table,Td,Th,Tr] = (
             'button,img,header,svg,g,path,rect,line,circle,text,table,td,th,tr'
             .split(',').map(toHookComposer));



// cases
// 1 propNames,  n results length (e.g., children)
// 1-n propNames, n results length (e.g., usestate)
export const prop = curryN(2,(propNames,propsMapper,hook=identity)=>{
  propNames = ensureArray(propNames);
  propsMapper = ensureFunction(propsMapper)
  return Object.defineProperty(function(props){
    if(propNames.length===1) return {...props,[propNames[0]]:hook(propsMapper(props))}
    const result = hook(propsMapper(props));
    if (propNames.length > result.length) throw new Error(`Prop fn Returned ${result.length} results. Needed one each for ${propNames}.`);
    return {...props,...ro((o,v,i)=>o[v]=result[i])(propNames)}
  },'name', {value: 'use'+propNames.map(capitalize).join(''), writable: false});
});


export const children = (...fnsOrComponents)=>prop('children',p=>React.Children.map([
  ...ensureArray(p.children),
  ...flatten(over(ma((C)=>{
    if(!C) return ()=>C;
    if(isString(C)) return ()=>C;
    if(isHookComposer(C)) return C;
    if(isFunction(C)) return C(p);
    if(isElement(C)) return C;
    throw new Error(`children accepts undefined,null,numbers,strings, hookComposers, and functions that return those. Received "${C}"`);
  })(fnsOrComponents))({'data-str':p['data-str']}))
],identity));


export const style = input=>cond(
  [isString,str=>style(styleStringToObj(str))],
  [isFunction,fn=>p=>style(fn(p))(p)],
  [isPlainObject,obj=>p=>merge({},p,{style:obj})],
  [stubTrue,arg=>{throw new TypeError('styles only works with objects, strings, or functions that return those');}]
)(input);


export const eventFactory = eventName => (setter=noop,fn=identity)=>p=>{
  const stateSetter=isFunction(setter)?setter:p[setter];
  const handler = evt=>fn(stateSetter,evt);
  return {...p,[eventName]:handler};
}


export const [onClick,onChange,onKeydown,onKeyup,onKeyPress,onSubmit,onInput] = (
             'onClick,onChange,onKeydown,onKeyup,onKeyPress,onSubmit,onInput'
             .split(',').map(s=>eventFactory(s)));


export const state = (v, fn, getInitial)=>prop([v,fn],ensureFunction(getInitial),useState);
