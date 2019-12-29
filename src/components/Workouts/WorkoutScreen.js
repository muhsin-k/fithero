/* @flow */

import * as React from 'react';
import { useCallback } from 'react';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { useNavigation } from 'react-navigation-hooks';
import WorkoutList from './WorkoutList';
import FABSnackbar from '../FABSnackbar';
import i18n from '../../utils/i18n';
import WorkoutComments from './WorkoutComments';
import type { WorkoutSchemaType } from '../../database/types';
import Screen from '../Screen';

type Props = {|
  workout: ?WorkoutSchemaType,
  workoutId: string,
  ListHeaderComponent?: React.StatelessFunctionalComponent<{}>,
  contentContainerStyle?: ViewStyleProp,
  extraListData?: Array<mixed>,
  snackbarVisible: boolean,
  dismissSnackbar: () => void,
|};

const WorkoutScreen = (props: Props) => {
  const {
    workout,
    workoutId,
    ListHeaderComponent,
    contentContainerStyle,
    extraListData,
    snackbarVisible,
    dismissSnackbar,
  } = props;
  const navigation = useNavigation();
  const { navigate } = navigation;

  const onAddExercises = useCallback(() => {
    navigate('Exercises', { day: workoutId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutId]);

  const onExercisePress = useCallback(
    (exerciseKey: string, customExerciseName: ?string) => {
      navigate('EditSets', {
        day: workoutId,
        exerciseKey,
        exerciseName: customExerciseName,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workoutId]
  );

  const onDismissSnackbar = useCallback(() => {
    dismissSnackbar();
  }, [dismissSnackbar]);

  const renderHeader = useCallback(() => {
    return (
      <>
        {ListHeaderComponent ? <ListHeaderComponent /> : null}
        {workout && workout.isValid() && workout.comments ? (
          <WorkoutComments comments={workout.comments} day={workout.id} />
        ) : null}
      </>
    );
  }, [ListHeaderComponent, workout]);

  return (
    <Screen>
      <WorkoutList
        contentContainerStyle={contentContainerStyle}
        workout={workout && workout.isValid() ? workout : null}
        onPressItem={onExercisePress}
        dayString={workoutId}
        ListHeaderComponent={renderHeader()}
        extraData={extraListData}
      />
      <FABSnackbar
        fabIcon="add"
        onDismiss={onDismissSnackbar}
        show={snackbarVisible}
        snackbarText={i18n.t('share_workout__empty')}
        onFabPress={onAddExercises}
      />
    </Screen>
  );
};

export default WorkoutScreen;
