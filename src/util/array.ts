import _ from 'lodash';

export const recursiveMap = <T, U>(
  array: T[],
  iteratee: (item: T) => U,
  childrenKey = 'children'
): U[] => {
  return _.map(array, node => {
    if (_.isArray((node as any)[childrenKey])) {
      return {
        ...iteratee(node),
        [childrenKey]: recursiveMap(
          (node as any)[childrenKey],
          iteratee,
          childrenKey
        ),
      } as U;
    } else {
      return iteratee(node);
    }
  });
};

export const recursiveFlat = <T>(
  list: T[],
  childrenKey = 'children',
  result: T[] = []
) => {
  list.forEach(item => {
    result.push(item);
    if (_.isArray(item[childrenKey])) {
      recursiveFlat(item[childrenKey], childrenKey, result);
    }
  });
  return result;
};
