import merge from 'lodash/merge'
import pipe from 'lodash/flow'

export const styleStringToObj = (()=>{
  const styleMatcher = /^([a-z]+)([A-Z0-9.:#+-]+)(.*)$/;
  const getSizeVal = (num,unit)=>`${num}${units[unit]}`;
  const getSizeObj = (key)=>(num,unit)=>({[key]:getSizeVal(num,unit)});
  const parseColor = (num,unit)=>(
    num.length===1&&num!=='#'
      ?`#${num}${num}${num}`
      :num.length===3
        ?`#${num}`
        :`${num}${unit}`
  );
  let parser = (str,[_,prefix,num,unit]=str.match(styleMatcher))=>prefixes[prefix](num,unit);
  if(process.env.NODE_ENV !== 'production'){
    parser = s => {
      try{
        const [_,prefix,num,unit]=s.match(styleMatcher); // eslint-disable-line no-unused-vars
        return prefixes[prefix](num,unit);
      } catch(e){
        console.warn(`invalid style: "${s}"`);
        return {};
      }
    };
  }

  const styleSeparator = ' ';
  const getCachedOrParseThenCache = (str)=>
    merge({},...str.split(styleSeparator).filter(s=>!!s).map(s=>cache[s]=cache[s]||parser(s)));

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
    m:pipe(getSizeVal,sz=>({marginTop:sz,marginRight:sz,marginBottom:sz,marginLeft:sz})),
    mt:getSizeObj('marginTop'),
    mr:getSizeObj('marginRight'),
    mb:getSizeObj('marginBottom'),
    ml:getSizeObj('marginLeft'),
    p:pipe(getSizeVal,sz=>({paddingTop:sz,paddingRight:sz,paddingBottom:sz,paddingLeft:sz})),
    pt:getSizeObj('paddingTop'),
    pr:getSizeObj('paddingRight'),
    pb:getSizeObj('paddingBottom'),
    pl:getSizeObj('paddingLeft'),
    // b:pipe(getSizeVal,sz=>({borderTop:sz,borderRight:sz,borderBottom:sz,borderLeft:sz})),
    // bt:getSizeObj('borderTop'),
    // br:getSizeObj('borderRight'),
    // bb:getSizeObj('borderBottom'),
    // bl:getSizeObj('borderLeft'),
    b:pipe(getSizeVal,sz=>({borderTopWidth:sz,borderRightWidth:sz,borderBottomWidth:sz,borderLeftWidth:sz})),
    bt:getSizeObj('borderTopWidth'),
    br:getSizeObj('borderRightWidth'),
    bb:getSizeObj('borderBottomWidth'),
    bl:getSizeObj('borderLeftWidth'),
    bc:(num,unit)=>({borderColor:parseColor(num,unit)}),
    brad:getSizeObj('borderRadius'),
    lh:getSizeObj('lineHeight'),
    t:(num,unit)=>({fontSize:getSizeVal(num,unit),lineHeight:getSizeVal((+num+0.4).toFixed(1),unit)}),
    tc:(num,unit)=>({color:parseColor(num,unit)}),//text color
    bg:(num,unit)=>({backgroundColor:parseColor(num,unit)}),//text color
    bgc:(num,unit)=>({backgroundColor:parseColor(num,unit)}),//text color

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
    '':'em',
    em:'em',
    x:'px',
    px:'px',
    '%':'%',
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
