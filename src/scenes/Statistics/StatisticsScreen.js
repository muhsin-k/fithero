/* @flow */

import * as React from 'react';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import {
  getAllWorkoutsWithExercises,
  getWorkoutsThisMonth,
  getWorkoutsThisWeek,
} from '../../database/services/WorkoutService';
import i18n from '../../utils/i18n';
import type {
  WorkoutSetSchemaType,
  WorkoutSchemaType,
} from '../../database/types';
import { getSetsThisWeek } from '../../database/services/WorkoutSetService';
import type { ThemeType } from '../../utils/theme/withTheme';
import type {
  AppThemeType,
  DefaultUnitSystemType,
  FirstDayOfTheWeekType,
} from '../../redux/modules/settings';
import { toLb } from '../../utils/metrics';
import WorkoutTimesChart from './WorkoutTimesChart';
import Screen from '../../components/Screen';
import { getDefaultNavigationOptions } from '../../utils/navigation';
import withTheme from '../../utils/theme/withTheme';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';

type NavigationOptions = {
  screenProps: {
    theme: AppThemeType,
  },
};

type Props = {
  defaultUnitSystem: DefaultUnitSystemType,
  firstDayOfTheWeek: FirstDayOfTheWeekType,
  theme: ThemeType,
};

const StatisticsScreen = (props: Props) => {
  const { width } = useWindowDimensions();
  const singleCardWidth = width / 2.5;
  const { theme } = props;
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );

  const firstDayOfTheWeek = useSelector(
    state => state.settings.firstDayOfTheWeek
  );

  const { data: allWorkouts } = useRealmResultsHook<WorkoutSchemaType>({
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query: useCallback(() => getAllWorkoutsWithExercises(), [
      firstDayOfTheWeek,
    ]),
  });

  const { data: workoutsThisMonth } = useRealmResultsHook<WorkoutSchemaType>({
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query: useCallback(() => getWorkoutsThisMonth(), [firstDayOfTheWeek]),
  });

  const { data: workoutsThisWeek } = useRealmResultsHook<WorkoutSchemaType>({
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query: useCallback(() => getWorkoutsThisWeek(), [firstDayOfTheWeek]),
  });

  const { data: setsThisWeek } = useRealmResultsHook<WorkoutSetSchemaType>({
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query: useCallback(() => getSetsThisWeek(), [firstDayOfTheWeek]),
  });

  const weekVolume = setsThisWeek.reduce(
    (previousValue, s) => previousValue + s.reps * s.weight,
    0
  );

  return (
    <Screen style={styles.screen}>
      <ScrollView
        horizontal
        style={styles.carousel}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
      >
        <Card
          style={[styles.singleCard, { width: singleCardWidth }, styles.first]}
        >
          <Text numberOfLines={1} style={styles.singleTitle}>
            {i18n.t('total_workouts')}
          </Text>
          <Text style={styles.singleNumber}>
            {allWorkouts ? allWorkouts.length : 0}
          </Text>
        </Card>
        <Card style={[styles.singleCard, { width: singleCardWidth }]}>
          <Text numberOfLines={1} style={styles.singleTitle}>
            {i18n.t('this_month')}
          </Text>
          <Text style={styles.singleNumber}>
            {workoutsThisMonth ? workoutsThisMonth.length : 0}
          </Text>
        </Card>
        <Card style={[styles.singleCard, { width: singleCardWidth }]}>
          <Text numberOfLines={1} style={styles.singleTitle}>
            {i18n.t('this_week')}
          </Text>
          <Text style={styles.singleNumber}>
            {workoutsThisWeek ? workoutsThisWeek.length : 0}
          </Text>
        </Card>
        <Card
          style={[styles.singleCard, { width: singleCardWidth }, styles.last]}
        >
          <Text numberOfLines={1} style={styles.singleTitle}>
            {i18n.t('week_volume')}
          </Text>
          <Text style={styles.singleNumber}>
            {Math.floor(
              defaultUnitSystem === 'metric' ? weekVolume : toLb(weekVolume)
            )}{' '}
            <Text style={[styles.unit, { color: theme.colors.secondaryText }]}>
              {defaultUnitSystem === 'metric'
                ? i18n.t('kg.unit', { count: Math.floor(weekVolume) })
                : i18n.t('lb')}
            </Text>
          </Text>
        </Card>
      </ScrollView>
      <Card style={styles.chartCard}>
        <Text style={[styles.singleTitle, styles.chartTitle]}>
          {i18n.t('workouts_per_week')}
        </Text>
        <WorkoutTimesChart theme={theme} />
      </Card>
    </Screen>
  );
};

StatisticsScreen.navigationOptions = ({ screenProps }: NavigationOptions) => {
  return {
    ...getDefaultNavigationOptions(screenProps.theme),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 8,
  },
  carousel: {
    flexGrow: 0,
    marginBottom: 8,
  },
  first: {
    marginLeft: 16,
  },
  last: {
    marginRight: 16,
  },
  singleCard: {
    padding: 16,
    marginRight: 8,
  },
  singleTitle: {
    fontSize: 14,
    paddingBottom: 8,
  },
  singleNumber: {
    fontSize: 18,
  },
  unit: {
    fontSize: 14,
  },
  chartCard: {
    flex: 1,
    padding: 16,
    marginHorizontal: 16,
  },
  chartTitle: {
    paddingBottom: 16,
  },
});

export default withTheme(StatisticsScreen);
