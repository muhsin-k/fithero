/* @flow */

import type { WorkoutSchemaType } from '../../database/types';

export type CopyWorkoutType = {
  selectedWorkout: ?WorkoutSchemaType,
};

export const SET_SELECTED_WORKOUT = 'fithero/copyWorkout/SET_SELECTED_WORKOUT';

type State = CopyWorkoutType;
type Action = {
  type: typeof SET_SELECTED_WORKOUT,
  payload: ?WorkoutSchemaType,
};

export const initialState: State = {
  selectedWorkout: null,
};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case SET_SELECTED_WORKOUT: {
      return {
        ...state,
        selectedWorkout: action.payload,
      };
    }
    default:
      return state;
  }
}

export const setSelectedWorkout = (payload: ?WorkoutSchemaType) => ({
  type: SET_SELECTED_WORKOUT,
  payload,
});
