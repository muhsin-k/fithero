/* @flow */

import { dateToWorkoutId, getToday } from '../../utils/date';

export type HomeType = {
  selectedDay: string,
  showSnackbar: boolean,
};

export const SET_SELECTED_DAY = 'fithero/home/SET_SELECTED_DAY';
export const TOGGLE_SNACKBAR = 'fithero/home/TOGGLE_SNACKBAR';

type State = HomeType;
type Action =
  | {
      type: typeof SET_SELECTED_DAY,
      payload: string,
    }
  | {
      type: typeof TOGGLE_SNACKBAR,
      payload: boolean,
    };

export const initialState: State = {
  selectedDay: dateToWorkoutId(getToday()),
  showSnackbar: false,
};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case SET_SELECTED_DAY: {
      return {
        ...state,
        selectedDay: action.payload,
      };
    }
    case TOGGLE_SNACKBAR: {
      return {
        ...state,
        showSnackbar: action.payload,
      };
    }
    default:
      return state;
  }
}

export const setSelectedDay = (payload: string) => ({
  type: SET_SELECTED_DAY,
  payload,
});

export const toggleSnackbar = (payload: boolean) => ({
  type: TOGGLE_SNACKBAR,
  payload,
});
