/* @flow */

import maxBy from 'lodash/maxBy';

import type {
  ExerciseSchemaType,
  WorkoutExerciseSchemaType,
  WorkoutSchemaType,
} from './types';
import type { RealmResults } from '../types';
import { dateToWorkoutId } from '../utils/date';

export const getExerciseSchemaId = (day: string, exerciseKey: string) =>
  `${dateToWorkoutId(day)}_${exerciseKey}`;

export const getExerciseSchemaIdFromSet = (setId: string) => {
  const parts = setId.split('_');
  return `${parts[0]}_${parts[1]}`;
};

export const getSetSchemaId = (
  day: string,
  exerciseKey: string,
  index: number
) =>
  `${getExerciseSchemaId(day, exerciseKey)}_${index
    .toString()
    .padStart(3, '0')}`;

export const extractExerciseKeyFromDatabase = (id: string) => id.split('_')[1];

export const extractSetIndexFromDatabase = (id: string) =>
  parseInt(id.split('_')[2], 10);

export const deserializeWorkout = (
  workout: WorkoutSchemaType,
  stringify: boolean = true
) => {
  const w: WorkoutSchemaType = stringify
    ? JSON.parse(JSON.stringify(workout))
    : workout;
  let exercises = Object.values(w.exercises);
  const hasExercises = exercises.length > 0;
  if (hasExercises) {
    exercises.forEach(exercise => {
      // $FlowFixMe
      exercise.sets = Object.values(exercise.sets);
    });
  }
  return {
    ...w,
    exercises,
  };
};

export const deserializeWorkouts = (
  workouts: RealmResults<WorkoutSchemaType>
): Array<WorkoutSchemaType> => {
  return Object.values(JSON.parse(JSON.stringify(workouts))).map(w => {
    // $FlowFixMe
    return deserializeWorkout(w, false);
  });
};

export const deserializeWorkoutExercise = (
  exercise: WorkoutExerciseSchemaType
): WorkoutExerciseSchemaType => {
  const sets = Object.values(JSON.parse(JSON.stringify(exercise.sets)));
  // $FlowFixMe
  return {
    ...exercise,
    sets,
  };
};

export const deserializeExercises = (
  exercises: RealmResults<ExerciseSchemaType>
): Array<ExerciseSchemaType> => {
  return Object.values(JSON.parse(JSON.stringify(exercises))).map(e => ({
    ...e,
    // $FlowFixMe
    primary: Object.values(e.primary),
    // $FlowFixMe
    secondary: Object.values(e.secondary),
  }));
};

export const getNextSetIndex = (exercise: WorkoutExerciseSchemaType) => {
  const lastSetId = maxBy(exercise.sets, 'id');
  return extractSetIndexFromDatabase(lastSetId.id);
};
