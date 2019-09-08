/* @flow */

import { Share } from 'react-native';

import type { WorkoutSchemaType } from '../database/types';
import { getExerciseName } from './exercises';
import i18n from './i18n';
import { toLb, toTwoDecimals } from './metrics';
import { getShareWorkoutPrettyDate } from './date';
import {
  getExerciseById,
  isCustomExercise,
} from '../database/services/ExerciseService';
import { extractExerciseKeyFromDatabase } from '../database/utils';

export const shareWorkout = async (workout: WorkoutSchemaType) => {
  let text = `FitHero - ${getShareWorkoutPrettyDate(workout.id)}\n\n`;
  for (let i = 0; i < workout.exercises.length; i++) {
    const e = workout.exercises[i];
    let exerciseCustomName = '';
    if (isCustomExercise(e.id)) {
      const exercise = await getExerciseById(
        extractExerciseKeyFromDatabase(e.id)
      );
      exerciseCustomName = exercise[0].name;
    }
    text += `${getExerciseName(e.type, exerciseCustomName)}\n`;
    e.sets.forEach((s, i) => {
      text += `${i + 1}. ${
        e.weight_unit === 'metric'
          ? `${i18n.t('kg.value', {
              count: toTwoDecimals(s.weight),
            })}`
          : `${toTwoDecimals(toLb(s.weight))} ${i18n.t('lb')}`
      } x ${i18n.t('reps.value', {
        count: s.reps,
      })}\n`;
    });
    text += '\n';
  }
  await Share.share({
    message: text,
  });
};
