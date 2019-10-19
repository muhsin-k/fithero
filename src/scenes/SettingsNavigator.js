/* @flow */

import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';

import i18n from '../utils/i18n';
import SettingsScreen from './Settings';

export default createNativeStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: i18n.t('menu__settings'),
    },
  },
});
