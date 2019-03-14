import {
  pick, pickBy,get,map as mapFP, transform as transformFP,flatten,mapValues as mapValuesFP,mapKeys,
  reduce as reduceFP,spread,rest,filter as filterFP,uniqueId,
  matches as matchesFP,concat,constant,overEvery,overSome,
  negate,flatMap,flattenDeep,over, identity, difference,isArray,
  isInteger,isError,isNumber,isObjectLike,hasIn,has,isWeakMap, isWeakSet, isMap, isSet,isEmpty,
  isString, isPlainObject, isFunction, isNull,isUndefined,set,unset,once,
  sortBy,keyBy,every,values,keys,zip,unzip,zipObject,union,conforms,intersection,nth,first,last
} from 'lodash/fp';

import {merge,mergeWith,set as _set} from 'lodash';

const [transform,filter,map,mapValues,reduce] = [
  transformFP,filterFP,mapFP,mapValuesFP,reduceFP].map(fn=>fn.convert({cap:false}));

export {
  identity,pick,spread,rest,
  uniqueId,concat,
  pickBy,
  over
}


// stubs
export const stubNull = ()=>null;
export const stubArray = ()=>[];
export const stubObject = ()=>({});
export const stubString = ()=>'';
export const stubTrue = ()=>true;
export const stubFalse = ()=>false;




// predicates
export const isFalsy = arg=>!arg;
export const isTruthy = arg=>!!arg;
export const is = val1=>val2=>val1===val2;
export const isUndefOrNull = val => val == undefined; // eslint-disable-line
export const isPromise = x=>!isUndefOrNull(x) && typeof x.then == 'function';
export const len = num=>({length})=>length===num;
export const len0 = len(0);
export const len1 = len(1);
export const isProductionEnv = ()=>process.env.NODE_ENV === 'production';
export const matches = arg=>matchesFP(arg);
export {isArray,isError,isInteger,isNumber,isObjectLike,hasIn,has,isWeakMap,isWeakSet,isMap,
        isSet,isEmpty,isString,isPlainObject,isFunction,isNull,isUndefined,every,conforms}

// debugging
export const plog = (msg='')=>pipeVal=>console.log(msg,pipeVal) || pipeVal;

// flow
export {once};
export const pipe = (fn1=identity,...fns)=>(arg1,...args)=>fns.reduce((a,f)=>f(a),fn1(arg1,...args));
export const dpipe = (data,...args)=>pipe(...args)(data);
export const compose = (...fns)=>pipe(...fns.reverse());

// casting
export {constant};
export const acceptArrayOrArgs = fn=>(...args)=>args.length>1 ? fn(args) : fn(...args);
export const ensureArray = (val=[])=>isArray(val) ? val : [val];
export const ensureFunction = (arg)=>typeof arg==='function'?arg:constant(arg);
export const ensurePropExists = fn=>(obj,key)=>obj.hasOwnProperty(key) ? obj[key] : (obj[key]=fn());
export const ensurePropIsArray = ensurePropExists(stubArray);
export const ensurePropIsObject = ensurePropExists(stubObject);

// logic
export const not = negate;
export const ifElse = (pred,T,F=identity)=>(...args)=>(pred(...args) ? T : F)(...args);
export const ife = ifElse;
export const and = rest(overEvery);
export const or = rest(overSome);
export const none = not(or);
export const xor = fn=>pipe(filter(fn),len1);
export const condNoExec = acceptArrayOrArgs(arrs=>(...x)=>{for (let [pred,val] of arrs){if(pred(...x)){return val;}}});
export const cond = acceptArrayOrArgs(arrs=>(...args)=>ensureFunction(condNoExec(...arrs)(...args))(...args));



// Array methods
export const slice = (...sliceArgs)=>arr=>arr.slice(...sliceArgs);
export const reverse = arr=>arr.slice(0).reverse(); // immutable array reverse
export const sort = sortBy(null)
export {sortBy,zip ,unzip ,difference ,union ,intersection};




// collections
// shortcuts for the most common collection operations
// prefixes = r,m,f,o,fm = reduce,map,filter,omit,filter+map
// suffixes = o,a,x = toObject,toArray,toX (where X is the same type as input)
export {reduce,merge,mergeWith,flatMap,flattenDeep,flatten};
export const ro=fn=>(...args)=>transform(fn,{})(...args);
export const ra=fn=>(...args)=>transform(fn,[])(...args);
export const ma=map;
export const mo=fn=>ifElse(isArray,ro((acc,v,i,c)=>{acc[i]=fn(v,i,c);}),mapValues)(fn);
export const fa=filter;
export const fo=pred=>ifElse(isArray,ro((o,v,k,c)=>{if(pred(v,k,c)){o[k]=v;}}),pickBy(pred));
export const oa=pipe(not,fa);
export const oo=pipe(not,fo);
export const fma=(pred,fn)=>ra((a,v,k,c)=>{if(pred(v,k,c)){a[a.length]=fn(v,k,c);}});
export const fmo=(pred,fn)=>ro((o,v,k,c)=>{if(pred(v,k,c)){o[k]=fn(v,k,c);}});
// partionObject((v,k)=>k=='a',(v,k)=>k!='a')({a:1,b:2,c:3}) =>[{a:1},{b:1,c:2}]
// partionObject((v,k)=>v==1,(v,k)=>v!=1)({a:1,b:2,c:3}) =>[{a:1,b:1},{c:2}]
// partionObject((v,k)=>v==1)({a:1,b:2,c:3}) =>[{a:1,b:1},{c:2}]
const partitionObject = (...preds)=>over([...(preds.map(fo)),fo(none(predicates))]);
const partitionArray = (...preds)=>over([...(preds.map(fa)),fa(none(predicates))]);
export const partition = ifElse(isArray,partitionArray,partitionObject);


// getters
export {get,set,_set,unset,nth,first,last,keyBy};
export const pget = cond(
  [isString,get],
  [isArray,pick],
  [isPlainObject, obj=>target=>mo(f=>pget(f)(target))(obj)],
  [stubTrue,identity], // handles the function case
);
export const groupByKeys = ro((o,item,ik,c)=>{
  for (const k in item){ensurePropIsArray(o,k).push(item)}
})
export const groupByValues = ro((o,item,k,c)=>{
  for (const k in item){
    for (const v of ensureArray(item[k])){
      ensurePropIsArray(o,`${v}`).push(item);
    }
  }
});



// Objects
export const objStringifierFactory = ({
  getPrefix=()=>'',
  getSuffix=()=>'',
  mapPairs=x=>x,
  keySplit = '=',
  pairSplit = '&'
} = {})=>(input={})=>{
  const output = Object.keys(input)
  .map(k=>([k, input[k]].map(mapPairs).join(keySplit)))
  .join(pairSplit);
  return getPrefix(input,output) + output + getSuffix(input, output);
};
export const objToUrlParams = objStringifierFactory({
  getPrefix:(input,output)=>output ? '?' : '',
  mapPairs:encodeURIComponent,
});