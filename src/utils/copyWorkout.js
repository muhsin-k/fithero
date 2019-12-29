/* @flow */

import type {
  AddWorkoutSchemaType,
  WorkoutSchemaType,
} from '../database/types';
import { toDate } from './date';
import realm from '../database';
import { WORKOUT_SCHEMA_NAME } from '../database/schemas/WorkoutSchema';
import {
  deserializeWorkout,
  getExerciseSchemaId,
  getNextSetIndex,
  getSetSchemaId,
} from '../database/utils';
import { getWorkoutByPrimaryKey } from '../database/services/WorkoutService';

export const copyWorkout = (
  selectedWorkout: WorkoutSchemaType,
  selectedDay: string
) => {
  const existingWorkout = getWorkoutByPrimaryKey(selectedDay);

  if (existingWorkout) {
    mergeWorkout(selectedDay, existingWorkout, selectedWorkout);
    return;
  }

  const toCopyWorkout = deserializeWorkout(selectedWorkout);
  const date = toDate(selectedDay);

  const newWorkout: AddWorkoutSchemaType = {
    id: selectedDay,
    date,
    // comments: '', // Do not copy comments
    exercises: [],
  };

  toCopyWorkout.exercises.forEach(e => {
    const exerciseIdDb = getExerciseSchemaId(selectedDay, e.type);
    const sets = e.sets.map((s, index) => {
      const setId = getSetSchemaId(selectedDay, e.type, index + 1);
      return {
        ...s,
        id: setId,
        date,
      };
    });
    newWorkout.exercises.push({
      ...e,
      id: exerciseIdDb,
      date,
      sets,
    });
  });

  realm.write(() => {
    realm.create(WORKOUT_SCHEMA_NAME, newWorkout);
  });
};

const mergeWorkout = (
  selectedDay,
  existingWorkout: WorkoutSchemaType,
  selectedWorkout: WorkoutSchemaType
) => {
  realm.write(() => {
    const date = toDate(selectedDay);
    selectedWorkout.exercises.forEach(exercise => {
      const foundExercise = existingWorkout.exercises.find(
        e => e.type === exercise.type
      );
      if (foundExercise) {
        const lastIndex = getNextSetIndex(foundExercise);

        exercise.sets.forEach((s, i) => {
          const setId = getSetSchemaId(
            selectedDay,
            foundExercise.type,
            lastIndex + i + 1
          );
          foundExercise.sets.push({
            ...s,
            id: setId,
            date,
          });
        });
      } else {
        const exerciseIdDb = getExerciseSchemaId(selectedDay, exercise.type);
        const sets = exercise.sets.map((s, index) => {
          const setId = getSetSchemaId(selectedDay, exercise.type, index + 1);
          return {
            ...s,
            id: setId,
            date,
          };
        });
        existingWorkout.exercises.push({
          ...exercise,
          id: exerciseIdDb,
          sets,
          date,
        });
      }
    });
    // Fix exercises sorting
    existingWorkout.exercises.forEach((exercise, index) => {
      exercise.sort = index + 1;
    });
  });
};
