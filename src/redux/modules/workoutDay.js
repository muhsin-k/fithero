/* @flow */

export type WorkoutDayType = {
  showSnackbar: boolean,
};

export const TOGGLE_SNACKBAR = 'fithero/workoutDay/TOGGLE_SNACKBAR';

type State = WorkoutDayType;
type Action = {
  type: typeof TOGGLE_SNACKBAR,
  payload: boolean,
};

export const initialState: State = {
  showSnackbar: false,
};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
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

export const toggleSnackbar = (payload: boolean) => ({
  type: TOGGLE_SNACKBAR,
  payload,
});
