/* @flow */

import { Platform } from 'react-native';

export const PACKAGE_NAME = 'com.fnp.fithero';

export const Settings = {
  defaultUnitSystem: `${PACKAGE_NAME}.preference.DEFAULT_UNIT_SYSTEM`,
  firstDayOfTheWeek: `${PACKAGE_NAME}.preference.FIRST_DAY_OF_THE_WEEK`,
  appTheme: `${PACKAGE_NAME}.preference.APP_THEME`,
};

export const isIOS13 =
  Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13;
