/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { getExerciseName } from '../utils/exercises';
import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../database/types';
import { extractExerciseKeyFromDatabase } from '../database/utils';
import { getWeightUnit } from '../utils/metrics';
import type { DefaultUnitSystemType } from '../redux/modules/settings';
import SetItem from './SetItem';
import useMaxSetsHook from './useMaxSetsHook';

type Props = {
  defaultUnitSystem: DefaultUnitSystemType,
  exercise: WorkoutExerciseSchemaType,
  customExerciseName?: string,
  onPressItem: (exerciseKey: string, customExerciseName?: string) => void,
};

const WorkoutItem = (props: Props) => {
  const {
    customExerciseName,
    defaultUnitSystem,
    exercise,
    onPressItem,
  } = props;

  const [maxSets, maxReps] = useMaxSetsHook(exercise);

  if (!exercise.isValid()) {
    return null;
  }

  const _renderSet = (set: WorkoutSetSchemaType, index: number) => {
    const unit = getWeightUnit(exercise, defaultUnitSystem);
    const maxSetId = maxSets.length > 0 ? maxSets[0].id : null;
    const maxRepId = maxReps.length > 0 ? maxReps[0].id : null;

    // $FlowFixMe type RealmObject(s) better
    if (!set.isValid()) {
      return null;
    }

    return (
      <SetItem
        key={set.id}
        set={set}
        maxSetId={maxSetId}
        maxRepId={maxRepId}
        index={index}
        unit={unit}
      />
    );
  };

  return (
    <Card
      style={styles.card}
      onPress={() => {
        onPressItem(
          extractExerciseKeyFromDatabase(exercise.id),
          customExerciseName
        );
      }}
    >
      <View>
        <Text>
          {getExerciseName(
            extractExerciseKeyFromDatabase(exercise.id),
            customExerciseName
          )}
        </Text>
        {exercise.sets.length > 0 && (
          <View style={styles.setsContainer}>
            {exercise.sets.map((set, index) => _renderSet(set, index))}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  setsContainer: {
    paddingTop: 12,
  },
});

export default React.memo<Props>(WorkoutItem);
