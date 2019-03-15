import {styleStringToObj as s} from './style-string-to-obj'

it("converts a string to a styles object", () => {
  expect(s('w100px h100px')).toEqual({width:'100px',height:'100px'});
});
