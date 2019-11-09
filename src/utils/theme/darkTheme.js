/* @flow */

import { Colors, DarkTheme as PaperDarkTheme } from 'react-native-paper';

import type { ThemeColorsType } from './types';
import type { ThemeType } from './withTheme';
import { isIOS13 } from '../constants';

const accent = '#a6ed8e';
const background = '#121212';
const surface = '#1e1e1e';
const selected = '#474747';

const ThemeColors: ThemeColorsType = {
  accent,
  background,
  borderColor: '#555555',
  calendarSelectedDayTextColor: background,
  calendarSelectedDotColor: background,
  chartBar: Colors.green200,
  chip: '#2e2e2e',
  chipSelected: selected,
  dialogBackground: '#383838',
  secondaryText: '#a0a0a0',
  selected,
  surface,
  primary: background,
  textSelection: Colors.red300,
  toolbar: '#121212',
  toolbarTint: Colors.white,
  trophy: accent,
  trophyReps: '#FFE082',
  textSegmentedControl: '#FFFFFF',
  backgroundSegmentedControl: isIOS13 ? '#3E3D42' : '#FFFFFF',
  selectedSegmentedControl: isIOS13 ? '#616161' : '#FFFFFF',
};

const DarkTheme: ThemeType = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...ThemeColors,
  },
};

export default DarkTheme;
