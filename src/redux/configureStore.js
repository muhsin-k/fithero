/* @flow */

import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import settings from './modules/settings';
import home from './modules/home';
import workoutDay from './modules/workoutDay';

const store = createStore(
  combineReducers({
    settings,
    home,
    workoutDay,
  }),
  applyMiddleware(thunk)
);

export const dispatch = store.dispatch;

export default store;
