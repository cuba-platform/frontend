import {sortEntityInstances} from './collation';

describe('sortEntityInstances function', () => {
  const obj1 = {a: 'a1', b: 1, _instanceName: '1'};
  const obj2 = {a: 'a2', b: 2, _instanceName: '2'};
  const obj3 = {a: 'a3', b: 3, _instanceName: '3'};
  const obj1b = {a: 'a1', b: 1, _instanceName: '1'};
  const objNoName = {a: 'a4', b: 4};

  const items = [
    {id: 0, num: 42,               str: 'Lorem ipsum',  bool: true,  obj: obj1},
    {id: 1, num: -13,              str: 'adipiscing',   bool: true,  obj: obj2},
    {id: 2, num: 0,                str: '  incididunt', bool: false, obj: obj3},
    {id: 3, num: 100,              str: '',             bool: false, obj: obj1},
    {id: 4, num: 9.98,             str: 'Aaaa',         bool: true,  obj: obj1b},
    {id: 5, num: Number.MAX_VALUE, str: ',Aaaa',        bool: true,  obj: {}},
    {id: 6, num: Number.MIN_VALUE, str: '😈Aaaa',       bool: true,  obj: objNoName},
    {id: 7, num: undefined, str: undefined, bool: undefined, obj: undefined},
    {id: 8, num: null, str: null, bool: null, obj: null},
  ];

  it('sorts correctly by a number field', async () => {
    checkSorting(items, 'num', [1, 2, 6, 4, 0, 3, 5, 7, 8], [7, 8, 5, 3, 0, 4, 6, 2, 1]);
  });
  it('sorts correctly by a string field', async () => {
    checkSorting(items, 'str', [3,4,5,6,1,2,0,7,8], [7,8,0,2,1,6,5,4,3]);
  });
  it('sorts correctly by a boolean field', async () => {
    checkSorting(items, 'bool', [2,3,0,1,6,5,4,7,8], [7,8,0,1,6,5,4,2,3]);
  });
  it('sorts correctly by an object field', async () => {
    checkSorting(items, 'obj', [6,5, 0,4,3,1,2, 7,8], [7,8, 2,1,0,4,3, 6,5]);
  });
});

function checkSorting(items: any[], fieldName: string, expectedAsc: any[], expectedDesc: any[]) {
  let res;
  res = sortEntityInstances(items, '+' + fieldName);
  expect(res.map(item => item.id)).toEqual(expectedAsc);
  res = sortEntityInstances(items, fieldName);
  expect(res.map(item => item.id)).toEqual(expectedAsc);
  res = sortEntityInstances(items, '-' + fieldName);
  expect(res.map(item => item.id)).toEqual(expectedDesc);
}
