/* @flow */

import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';

import i18n from '../utils/i18n';
import StatisticsScreen from './Statistics';

export default createNativeStackNavigator({
  Statistics: {
    screen: StatisticsScreen,
    navigationOptions: {
      title: i18n.t('menu__statistics'),
    },
  },
});
