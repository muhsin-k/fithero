/* @flow */

import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  getDatePrettyFormat,
  getToday,
  dateToWorkoutId,
} from '../../utils/date';
import { getWorkoutById } from '../../database/services/WorkoutService';
import type { NavigationType } from '../../types';
import type { WorkoutSchemaType } from '../../database/types';
import i18n from '../../utils/i18n';
import HeaderOverflowButton from '../../components/Header/HeaderOverflowButton';
import type { ThemeType } from '../../utils/theme/withTheme';
import { getDefaultNavigationOptions } from '../../utils/navigation';
import WorkoutScreen from '../../components/Workouts/WorkoutScreen';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import { useNavigationParam } from 'react-navigation-hooks';
import { dispatch } from '../../redux/configureStore';
import { toggleSnackbar } from '../../redux/modules/workoutDay';
import { handleWorkoutToolbarMenu } from '../../utils/overflowActions';

type NavigationObjectType = {
  navigation: NavigationType<{ day: string, handleToolbarMenu: () => void }>,
};

type NavigationOptions = NavigationObjectType & {
  screenProps: {
    theme: ThemeType,
  },
};

const WorkoutDayScreen = () => {
  const workoutId = dateToWorkoutId(useNavigationParam('day'));
  const showSnackbar = useSelector(state => state.workoutDay.showSnackbar);
  const dispatch = useDispatch();

  const { data } = useRealmResultsHook<WorkoutSchemaType>({
    query: useCallback(() => getWorkoutById(workoutId), [workoutId]),
  });

  const workout = data.length > 0 ? data[0] : null;

  const dismissSnackbar = useCallback(() => {
    dispatch(toggleSnackbar(false));
  }, [dispatch]);

  return (
    <WorkoutScreen
      contentContainerStyle={styles.list}
      workout={workout && workout.isValid() ? workout : null}
      workoutId={workoutId}
      snackbarVisible={showSnackbar}
      dismissSnackbar={dismissSnackbar}
    />
  );
};

WorkoutDayScreen.navigationOptions = ({
  navigation,
  screenProps,
}: NavigationOptions) => {
  const { params = {} } = navigation.state;

  const handleToolbarMenu = (index: number) => {
    const workoutId = dateToWorkoutId(params.day);
    handleWorkoutToolbarMenu({
      index,
      selectedDay: workoutId,
      navigate: navigation.navigate,
      showSnackbar: () => dispatch(toggleSnackbar(true)),
    });
  };

  return {
    ...getDefaultNavigationOptions(screenProps.theme),
    title: getDatePrettyFormat(params.day, getToday(), true),
    headerRight: (
      <HeaderOverflowButton
        actions={[i18n.t('comment_workout'), i18n.t('share_workout')]}
        onPress={handleToolbarMenu}
        last
      />
    ),
  };
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 56 + 32, // Taking FAB into account
  },
});

export default WorkoutDayScreen;
