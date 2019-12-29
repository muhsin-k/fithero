/* @flow */

import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import settings from './modules/settings';
import home from './modules/home';
import workoutDay from './modules/workoutDay';
import copyWorkout from './modules/copyWorkout';

const store = createStore(
  combineReducers({
    settings,
    home,
    workoutDay,
    copyWorkout,
  }),
  applyMiddleware(thunk)
);

export const dispatch = store.dispatch;

export default store;
