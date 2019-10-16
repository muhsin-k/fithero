/* @flow */

import { useCallback } from 'react';

import useRealmResultsHook from './useRealmResultsHook';
import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../database/types';
import {
  getMaxRepByType,
  getMaxSetByType,
} from '../database/services/WorkoutSetService';

const useMaxSetsHook = (exercise: ?WorkoutExerciseSchemaType) => {
  const { data: maxSets } = useRealmResultsHook<WorkoutSetSchemaType>(
    useCallback(() => {
      if (exercise && exercise.isValid()) {
        // It's possible that we delete the whole exercise so this access to .sets would be invalid
        return getMaxSetByType(exercise.type);
      }
    }, [exercise])
  );

  const { data: maxReps } = useRealmResultsHook<WorkoutSetSchemaType>(
    useCallback(() => {
      if (exercise && exercise.isValid()) {
        return getMaxRepByType(exercise.type);
      }
    }, [exercise])
  );

  return [maxSets, maxReps];
};

export default useMaxSetsHook;
