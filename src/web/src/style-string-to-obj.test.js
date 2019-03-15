import {styleStringToObj as s} from './style-string-to-obj'

it("converts a string to a styles object", () => {
  expect(s('w100px h100px')).toEqual({width:'100px',height:'100px'});
});
it("caches converted styles objects for performance", () => {
  expect(s('w100px h100px')).toBe(s('w100px h100px'));
});
it("warns on invalid strings", () => {
  global.console._warn_temp = global.console.warn;
  global.console.warn = jest.fn();
  s('wwwww100px');
  expect(global.console.warn).toHaveBeenCalledWith(
    'invalid style: "wwwww100px". See style-string-to-obj.test.js for correct syntax.')
  global.console.warn = global.console._warn_temp;
  delete global.console._warn_temp;
});

const units={
  '':'em',
  em:'em',
  x:'px',
  px:'px',
  '%':'%',
};
const prefixes ={
  left:'left',
  right:'right',
  top:'top',
  bottom:'bottom',
  w:'width',
  h:'height',
  minw:'minWidth',
  maxw:'maxWidth',
  minh:'minHeight',
  maxh:'maxHeight',
  mt:'marginTop',
  mr:'marginRight',
  mb:'marginBottom',
  ml:'marginLeft',
  pt:'paddingTop',
  pr:'paddingRight',
  pb:'paddingBottom',
  pl:'paddingLeft',
  bt:'borderTopWidth',
  br:'borderRightWidth',
  bb:'borderBottomWidth',
  bl:'borderLeftWidth',
  brad:'borderRadius',
  lh:'lineHeight',
}

let u,prefix;
for (u in units){
  for (prefix in prefixes){
    expect(s(`${prefix}1${u}`)).toEqual({[prefixes[prefix]]:`1${units[u]}`})
  }
}

expect(s('m1')).toEqual({marginTop:'1em',marginRight:'1em',marginBottom:'1em',marginLeft:'1em'})
expect(s('p1')).toEqual({paddingTop:'1em',paddingRight:'1em',paddingBottom:'1em',paddingLeft:'1em'})
expect(s('b1')).toEqual({borderTopWidth:'1em',borderRightWidth:'1em',borderBottomWidth:'1em',borderLeftWidth:'1em'})

expect(s('t1')).toEqual({fontSize:'1em',lineHeight:`${(1+0.4).toFixed(1)}em`});
expect(s('bgc000')).toEqual({backgroundColor:'#000'})
expect(s('bg000')).toEqual({backgroundColor:'#000'})
expect(s('z1')).toEqual({zIndex:'1'})


expect(s('z1')).toEqual({zIndex:'1'})
expect(s('above800_w1')).toEqual({'@media (min-width: 799px)':{width:'1em'}});
expect(s('below800_w1')).toEqual({'@media (max-width: 800px)':{width:'1em'}});

/* pseudoclasses: requires some lib (e.g., styletron) that converts styles to an actual stylesheet */
// nth:(num,unit)=>({[`:nth-child(${num})`]:parseNested(unit)}),
//   select = 6 nth6
//   select >=6 nthn1+6
//   select <=6 nthn-+6
//   select %2 nthn2
//   select odds nthn2-1
//   select every 4th,starting at 1 nthn4+1
//   select second to last (not implemented) nth-last-child(2)
// nthn:(num,unit)=>({[`:nth-child(${num[0]}n${num.slice(1)})`]:parseNested(unit)}),
// before:(num,unit)=>({':before':parseNested(unit)}),
// after:(num,unit)=>({':after':parseNested(unit)}),
// first:(num,unit)=>({':first-child':parseNested(unit)}),
// last:(num,unit)=>({':last-child':parseNested(unit)}),
// link:(num,unit)=>({':link':parseNested(unit)}),
// visited:(num,unit)=>({':visited':parseNested(unit)}),
// hover:(num,unit)=>({':hover':parseNested(unit)}),
// active:(num,unit)=>({':active':parseNested(unit)}),
