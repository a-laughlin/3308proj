import merge from 'lodash/merge'
import pipe from 'lodash/flow'

export const styleStringToObj = (()=>{
  const styleMatcher = /^([a-z]+)([A-Z0-9.:#+-]+)(.*)$/;
  const valSetterFactory = fn=>(...keys)=>pipe(fn,sz=>keys.reduce((o,k)=>{o[k]=sz;return o;},{}));
  const parseColor = (num,unit)=>(
    num.length===1&&num!=='#'
      ?`#${num}${num}${num}`
      :num.length===3
        ?`#${num}`
        :`${num}${unit}`
  );
  const getSizeVal = (num,unit)=>`${num}${units[unit]}`;
  const getSizeObj = valSetterFactory(getSizeVal);
  const getColorObj = valSetterFactory(parseColor);
  const parser = (str)=>{
    try{
      const [_,prefix,num,unit]=str.match(styleMatcher) // eslint-disable-line no-unused-vars
      return prefixes[prefix](num,unit)
    } catch(e){
      global.console && console.warn(`invalid style: "${str}". See style-string-to-obj.test.js for correct syntax.`);
      return {};
    }
  };

  const styleSeparator = ' ';
  const getCachedOrParseThenCache = (str)=>{
    if(str.raw) str=str.raw[0]; // handle tagged template strings e.g., s`w100px`;
    return cache[str]||(cache[str]=merge({},...str.split(styleSeparator).filter(s=>!!s).map(s=>cache[s]||(cache[s]=parser(s)))));
  }
  const parseNested = str=>styleStringToObj(str.replace(nestedSplitter,styleSeparator))
  const nestedSplitter = /_/g;
  const prefixes ={
    left:getSizeObj('left'),
    right:getSizeObj('right'),
    top:getSizeObj('top'),
    bottom:getSizeObj('bottom'),
    w:getSizeObj('width'),
    h:getSizeObj('height'),
    z:(num)=>({zIndex:num}),
    minw:getSizeObj('minWidth'),
    maxw:getSizeObj('maxWidth'),
    minh:getSizeObj('minHeight'),
    maxh:getSizeObj('maxHeight'),
    m:getSizeObj('marginTop','marginRight','marginBottom','marginLeft'),
    mt:getSizeObj('marginTop'),
    mr:getSizeObj('marginRight'),
    mb:getSizeObj('marginBottom'),
    ml:getSizeObj('marginLeft'),
    p:getSizeObj('paddingTop','paddingRight','paddingBottom','paddingLeft'),
    pt:getSizeObj('paddingTop'),
    pr:getSizeObj('paddingRight'),
    pb:getSizeObj('paddingBottom'),
    pl:getSizeObj('paddingLeft'),
    b:getSizeObj('borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth'),
    bt:getSizeObj('borderTopWidth'),
    br:getSizeObj('borderRightWidth'),
    bb:getSizeObj('borderBottomWidth'),
    bl:getSizeObj('borderLeftWidth'),
    bc:getColorObj('borderColor'),
    brad:getSizeObj('borderRadius'),
    lh:getSizeObj('lineHeight'),
    t:(num,unit)=>({fontSize:getSizeVal(num,unit),lineHeight:getSizeVal((+num+0.4).toFixed(1),unit)}),
    tc:getColorObj('color'),//text color
    bg:getColorObj('backgroundColor'),//text color
    bgc:getColorObj('backgroundColor'),//text color

    // svg-specific
    fill:(num,unit)=>({fill:parseColor(num,unit)}),//text color
    strk:getSizeObj('stroke'),
    strkw:getSizeObj('strokeWidth'),
    transx:pipe(getSizeVal,sz=>({transform:`translateX(${sz})`})),
    transy:pipe(getSizeVal,sz=>({transform:`translateY(${sz})`})),
    /* pseudoclasses: requires some lib (e.g., styletron) that converts styles to an actual stylesheet */
    nth:(num,unit)=>({[`:nth-child(${num})`]:parseNested(unit)}),
    // select = 6 nth6
    // select >=6 nthn1+6
    // select <=6 nthn-+6
    // select %2 nthn2
    // select odds nthn2-1
    // select every 4th,starting at 1 nthn4+1
    // select second to last (not implemented) nth-last-child(2)
    nthn:(num,unit)=>({[`:nth-child(${num[0]}n${num.slice(1)})`]:parseNested(unit)}),
    before:(num,unit)=>({':before':parseNested(unit)}),
    after:(num,unit)=>({':after':parseNested(unit)}),
    first:(num,unit)=>({':first-child':parseNested(unit)}),
    last:(num,unit)=>({':last-child':parseNested(unit)}),
    link:(num,unit)=>({':link':parseNested(unit)}),
    visited:(num,unit)=>({':visited':parseNested(unit)}),
    hover:(num,unit)=>({':hover':parseNested(unit)}),
    active:(num,unit)=>({':active':parseNested(unit)}),
    above:(num,unit)=>({[`@media (min-width: ${num-1}px)`]:parseNested(unit)}),
    below:(num,unit)=>({[`@media (max-width: ${num}px)`]:parseNested(unit)}),
  }
  const units={
    '':'%',
    '%':'%',
    e:'em',
    em:'em',
    p:'px',
    px:'px',
  };
  const cache = {
    // lists
    fInline:{display:'inline-flex'},
    fShrink0:{flexShrink:'0'},
    fGrow1:{flexGrow:'1'},
    fAIS:{alignItems:'flex-start'},
    fACS:{alignContent:'flex-start'},
    fAIC:{alignItems:'center'},
    fAIStretch:{alignItems:'stretch'},
    fACC:{alignContent:'center'},
    fAIE:{alignItems:'flex-end'},
    fACE:{alignContent:'flex-end'},
    fJCE:{justifyContent:'flex-end'},
    fJCS:{justifyContent:'flex-start'},
    fJCStretch:{justifyContent:'stretch'},
    fJCC:{justifyContent:'center'},
    fJCSA:{justifyContent:'space-around'},
    fJCSB:{justifyContent:'space-between'},
    fJCSE:{justifyContent:'space-evenly'},

    // borders
    bS:{borderStyle:'solid'},
    bD:{borderStyle:'dashed'},
    // text
    tSerif:{fontFamily: `serif`},
    tCapital:{textTransform:'capital'},
    tUpper:{textTransform:'uppercase'},
    tLower:{textTransform:'lowercase'},
    tUnderline:{textDecoration:'underline'},
    tItalic:{textDecoration:'italic'},
    tBold:{fontWeight:'700'},
    // vertical-align
    tvaM:{verticalAlign:'middle'},
    tvaT:{verticalAlign:'top'},
    tvaB:{verticalAlign:'bottom'},
    taC:{textAlign:'middle'},
    taL:{textAlign:'top'},
    taR:{textAlign:'bottom'},
    // tSans from https://css-tricks.com/snippets/css/system-font-stack/
    tSans:{ fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,`+
      `Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif`},
    // sizes
    wAuto:{width:`auto`},
    hAuto:{height:`auto`},
    mtAuto:{marginTop:`auto`},
    mrAuto:{marginRight:`auto`},
    mbAuto:{marginBottom:`auto`},
    mlAuto:{marginLeft:`auto`},
    mAuto:{marginTop:`auto`,marginRight:`auto`,marginBottom:`auto`,marginLeft:`auto`},
    mInherit:{marginTop:`inherit`,marginRight:`inherit`,marginBottom:`inherit`,marginLeft:`inherit`},
    wInherit:{width:`inherit`},
    hInherit:{height:`inherit`},
    mtInherit:{marginTop:`inherit`},
    mrInherit:{marginRight:`inherit`},
    mbInherit:{marginBottom:`inherit`},
    mlInherit:{marginLeft:`inherit`},


    // white-space
    wsN:{whiteSpace:'normal'},
    wsNW:{whiteSpace:'no-wrap'},
    wsPL:{whiteSpace:'pre-line'},
    wsP:{whiteSpace:'pre'},
    // word-break
    wbN:{wordBreak:'normal'},
    wbBA:{wordBreak:'break-all'},
    wbKA:{wordBreak:'keep-all'},
    wbBW:{wordBreak:'break-word'},
    // overflow-wrap
    owBW:{overflowWrap:'break-word'},
    owN:{overflowWrap:'normal'},
    // overflow
    oH:{overflow:'hidden'},
    oV:{overflow:'visible'},
    oS:{overflow:'scroll'},
    oA:{overflow:'auto'},
    oxH:{overflowX:'hidden'},
    oxV:{overflowX:'visible'},
    oxS:{overflowX:'scroll'},
    oxA:{overflowX:'auto'},
    oyH:{overflowY:'hidden'},
    oyV:{overflowY:'visible'},
    oyS:{overflowY:'scroll'},
    oyA:{overflowY:'auto'},
    // display
    dB:{display:'block'},
    dN:{display:'none'},
    dIF:{display:'inline-flex'},
    dI:{display:'inline'},
    // visibility
    vV:{visibility:'visible'},
    vH:{visibility:'hidden'},
    // position
    posA:{position:'absolute'},
    posR:{position:'relative'},
    posF:{position:'fixed'},
    posS:{position:'sticky'},
    posStatic:{position:'static'},
    // cursor
    crP:{cursor:'pointer'},
    crD:{cursor:'default'},
    // pointer-events
    peN:{pointerEvents:'none',touchAction:'none'},
    // user-select
    usN:{userSelect:'none'},
    usT:{userSelect:'text'},
    usC:{userSelect:'contain'},
    usA:{userSelect:'all'},

  };
  cache.tLink = {
    ...cache.tUnderline,
    ':link':cache.tUnderline,
    ':visited':cache.tUnderline,
    ':hover':cache.tUnderline,
    ':active':cache.tUnderline,
  };

  cache.fh = {
    listStyleType:'none',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'flex-start',
    justifyContent:'flex-start',
    flexWrap:'nowrap',
  };
  cache.fv = {
    ...cache.fh,
    flexDirection:'column',
    alignItems:'flex-start',
  };
  cache.fg = {
    ...cache.fh,
    flexWrap:'wrap',
    alignItems:'flex-start',
    justifyContent:'space-evenly',
  };

  cache.fhi = {
    listStyleType:'none',
    flexGrow:'0',
    flexShrink:'1',
    flexBasis:'auto',
    width:'auto',
    height:'auto',
  };
  cache.fvi = {
    ...cache.fhi,
    flexShrink:'0',
  };
  cache.fgi = {
    ...cache.fhi,
  };


  return getCachedOrParseThenCache;
})();


export default styleStringToObj;
