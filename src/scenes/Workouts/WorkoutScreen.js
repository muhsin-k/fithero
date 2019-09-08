/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';

import WorkoutList from '../../components/WorkoutList';
import {
  getDatePrettyFormat,
  getToday,
  dateToWorkoutId,
} from '../../utils/date';
import { getWorkoutById } from '../../database/services/WorkoutService';
import type { NavigationType } from '../../types';
import type { WorkoutSchemaType } from '../../database/types';
import DataProvider from '../../components/DataProvider';
import Screen from '../../components/Screen';
import WorkoutComments from '../../components/WorkoutComments';
import i18n from '../../utils/i18n';
import HeaderOverflowButton from '../../components/HeaderOverflowButton';
import type { ThemeType } from '../../utils/theme/withTheme';
import { getDefaultNavigationOptions } from '../../utils/navigation';
import { shareWorkout } from '../../utils/share';
import FABSnackbar from '../../components/FABSnackbar';

type NavigationObjectType = {
  navigation: NavigationType<{ day: string, handleToolbarMenu: () => void }>,
};

type NavigationOptions = NavigationObjectType & {
  screenProps: {
    theme: ThemeType,
  },
};

type Props = NavigationObjectType & {};

type State = {
  snackbarVisible: boolean,
};

class WorkoutScreen extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationOptions) => {
    const { params = {} } = navigation.state;
    return {
      ...getDefaultNavigationOptions(screenProps.theme),
      title: getDatePrettyFormat(navigation.state.params.day, getToday(), true),
      headerRight: (
        <HeaderOverflowButton
          actions={[i18n.t('comment_workout'), i18n.t('share_workout')]}
          onPress={params.handleToolbarMenu}
          last
        />
      ),
    };
  };

  state = {
    snackbarVisible: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleToolbarMenu: this._handleToolbarMenu,
    });
  }

  _handleToolbarMenu = (index: number) => {
    switch (index) {
      case 0:
        this._addWorkoutComment();
        break;
      case 1:
        this._shareWorkout();
        break;
      default:
        break;
    }
  };

  _addWorkoutComment = () => {
    const day = this.props.navigation.state.params.day;
    this.props.navigation.navigate('Comments', { day });
  };

  _shareWorkout = async () => {
    const day = dateToWorkoutId(this.props.navigation.state.params.day);
    const workouts = getWorkoutById(day);
    const workout = workouts.length > 0 ? workouts[0] : null;
    if (workout) {
      await shareWorkout(workout);
    } else {
      this.setState({ snackbarVisible: true });
    }
  };

  _onAddExercises = () => {
    const day = this.props.navigation.state.params.day;
    this.props.navigation.navigate('Exercises', { day });
  };

  _onDismissSnackbar = () => {
    this.setState({ snackbarVisible: false });
  };

  _onExercisePress = (exerciseKey: string, customExerciseName?: string) => {
    const day = this.props.navigation.state.params.day;
    this.props.navigation.navigate('EditSets', {
      day,
      exerciseKey,
      exerciseName: customExerciseName,
    });
  };

  _renderHeader(workout: ?WorkoutSchemaType, day: string) {
    if (workout && workout.comments) {
      return <WorkoutComments comments={workout.comments} day={day} />;
    }
    return null;
  }

  render() {
    const day = dateToWorkoutId(this.props.navigation.state.params.day);

    return (
      <Screen>
        <DataProvider
          query={getWorkoutById}
          args={[day]}
          parse={(data: Array<WorkoutSchemaType>) =>
            data.length > 0 ? data[0] : null
          }
          render={(workout: ?WorkoutSchemaType) => (
            <WorkoutList
              contentContainerStyle={styles.list}
              workout={workout}
              onPressItem={this._onExercisePress}
              ListHeaderComponent={() => this._renderHeader(workout, day)}
              dayString={day}
            />
          )}
        />
        <FABSnackbar
          fabIcon="add"
          onDismiss={this._onDismissSnackbar}
          show={this.state.snackbarVisible}
          snackbarText={i18n.t('share_workout__empty')}
          onFabPress={this._onAddExercises}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 56 + 32, // Taking FAB into account
  },
});

export default WorkoutScreen;
