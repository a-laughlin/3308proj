import {/*useState, useEffect, */createElement} from 'react';
import {cond,isFunction,isString,isPlainObject,stubTrue,pipe,oo} from './utils'
import {styleStringToObj} from './style-string-to-obj'


export const toHookComposer = (component)=>(...hooks)=>{
  return function hookComposer (props){
    if (props['data-hooks-from-parent']){
      hooks=[...hooks,...props['data-hooks-from-parent']]
      props=oo(['data-hooks-from-parent'])(props)
    }
    return createElement(component, pipe(...hooks)(props) )
  }
};
export const [Div,Span,Ul,Ol,Dt,Dd,Dl,Article,P,H1,H2,H3,H4,H5,H6,Li,Input,A,Label,Pre,Textarea] = (
             'div,span,ul,ol,dt,dd,dl,article,p,h1,h2,h3,h4,h5,h6,li,input,a,label,pre,textarea'
             .split(',').map(toHookComposer));
export const [Button,Img,Header,Svg,G,Path,Rect,Line,Circle,Text,Table,Td,Th,Tr] = (
             'button,img,header,svg,g,path,rect,line,circle,text,table,td,th,tr'
             .split(',').map(toHookComposer));


// higher order hooks
export const withStyles=cond(
  [isString,pipe(styleStringToObj,obj=>withStyles(obj))],
  [isFunction,fn=>props=>withStyles(fn(props))(props)],
  [isPlainObject,obj=>function useStyle(props){return {...props,style:{...(props.style||{}),...obj}}}],
  [stubTrue,arg=>{throw new TypeError('withStyles only works with objects, strings, or functions that return those');}]
);

export const withChildren=(component='div',dataProp='data',...childHooks)=>{
  if (component.name!=='hookComposer'){component=toHookComposer(component);}
  return function useChildren(props){
    return {
      ...oo([dataProp])(props),
      children:(props[dataProp]||[]).map(childProps=>component(...childHooks)(childProps))
    }
  }
}

export const withChildHooks=(...childHooks)=>{
  return function useChildHooks(props){
    return { ...props, 'data-hooks-from-parent':childHooks }
  }
}
