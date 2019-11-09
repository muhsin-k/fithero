/* @flow */

import { Colors, DarkTheme } from 'react-native-paper';

import type { ThemeColorsType } from './types';
import type { ThemeType } from './withTheme';
import { isIOS13 } from '../constants';

const primary = '#415B76';
const accent = '#a6ed8e';
const selected = '#66809B';
const surface = '#526c87';

const ThemeColors: ThemeColorsType = {
  accent,
  background: primary,
  borderColor: '#2A3D55',
  calendarSelectedDayTextColor: primary,
  calendarSelectedDotColor: primary,
  chartBar: '#F5F5DC',
  chip: surface,
  chipSelected: selected,
  dialogBackground: '#415B76',
  primary,
  selected,
  secondaryText: 'rgba(255, 255, 255, .7)',
  surface,
  textSelection: '#6f8691',
  toolbar: primary,
  toolbarTint: Colors.white,
  trophy: accent,
  trophyReps: '#FFE082',
  textSegmentedControl: '#FFFFFF',
  backgroundSegmentedControl: isIOS13 ? surface : '#FFFFFF',
  selectedSegmentedControl: isIOS13 ? selected : '#FFFFFF',
};

const Theme: ThemeType = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...ThemeColors,
  },
};

export default Theme;
