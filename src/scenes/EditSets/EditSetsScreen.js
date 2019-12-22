/* @flow */

import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import Screen from '../../components/Screen';
import type { NavigationType } from '../../types';
import { getExerciseSchemaId } from '../../database/utils';
import EditSetsWithControls from './EditSetsWithControls';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import { getWorkoutExerciseById } from '../../database/services/WorkoutExerciseService';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import type { WorkoutExerciseSchemaType } from '../../database/types';

type Props = {
  navigation: NavigationType<{
    day: string,
    exerciseKey: string,
    exerciseName?: string,
  }>,
};

const EditSetsScreen = (props: Props) => {
  const { day, exerciseKey } = props.navigation.state.params;
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );

  const id = getExerciseSchemaId(day, exerciseKey);
  const { data } = useRealmResultsHook<WorkoutExerciseSchemaType>({
    query: useCallback(() => getWorkoutExerciseById(id), [id]),
  });
  const exercise = data.length > 0 ? data[0] : null;

  return (
    <Screen style={styles.container}>
      <EditSetsWithControls
        testID="edit-sets-with-controls"
        day={day}
        exerciseKey={exerciseKey}
        exercise={exercise}
        defaultUnitSystem={defaultUnitSystem}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
});

export default EditSetsScreen;
