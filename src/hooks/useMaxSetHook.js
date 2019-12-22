/* @flow */

import { useCallback } from 'react';

import useRealmResultsHook from './useRealmResultsHook';
import type { WorkoutSetSchemaType } from '../database/types';

const useMaxSetHook = (
  type: ?string,
  getMaxFnByType: (type: string) => *,
  debounceTime: number = 0
) => {
  const { data: maxSets } = useRealmResultsHook<WorkoutSetSchemaType>({
    query: useCallback(() => {
      if (!type) {
        return null;
      }
      return getMaxFnByType(type);
    }, [getMaxFnByType, type]),
    debounceTime,
    prevFn: data =>
      data.length > 0 ? JSON.parse(JSON.stringify(data[0])) : null,
    hasChanged: (prev, current) => {
      if (current.length === 0) {
        return false;
      }
      return JSON.stringify(prev) !== JSON.stringify(current[0]);
    },
  });

  return maxSets.length > 0 ? maxSets[0] : null;
};

export default useMaxSetHook;
