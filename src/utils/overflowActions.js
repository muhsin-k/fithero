/* @flow */

import { getWorkoutById } from '../database/services/WorkoutService';
import { shareWorkout } from './share';
import type { NavigateType } from '../types';
import type { WorkoutSchemaType } from '../database/types';

export const handleWorkoutToolbarMenu = async ({
  index,
  selectedDay,
  navigate,
  showSnackbar,
}: {
  index: number,
  selectedDay: string,
  navigate: NavigateType,
  showSnackbar: () => void,
}) => {
  switch (index) {
    case 0: {
      navigate('Comments', { day: selectedDay });
      break;
    }
    case 1: {
      const workouts: Array<WorkoutSchemaType> = getWorkoutById(selectedDay);
      const workout = workouts.length > 0 ? workouts[0] : null;
      if (workout && workout.exercises.length > 0) {
        await shareWorkout(workout);
      } else {
        showSnackbar();
      }
      break;
    }
    case 2: {
      navigate('CopyWorkout', { day: selectedDay });
      break;
    }
    default:
      break;
  }
};
