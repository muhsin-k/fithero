/* @flow */

import { getWorkoutById } from '../database/services/WorkoutService';
import { shareWorkout } from './share';
import type { NavigateType } from '../types';

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
      const workouts = getWorkoutById(selectedDay);
      const workout = workouts.length > 0 ? workouts[0] : null;
      if (workout) {
        await shareWorkout(workout);
      } else {
        showSnackbar();
      }
      break;
    }
    default:
      break;
  }
};
