/* @flow */

import { muscles, exercisesTitles } from 'fithero-exercises';

import en from './en.json';

export default {
  ...en,
  ...exercisesTitles,
  ...muscles,
};
