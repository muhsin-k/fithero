/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { getDatePrettyFormat } from '../../../utils/date';
import type { WorkoutExerciseSchemaType } from '../../../database/types';
import SetItem from '../../../components/SetItem';

type Props = {|
  exercise: WorkoutExerciseSchemaType,
  maxSetId: ?string,
  maxRepId: ?string,
  todayString: string,
|};

const ExerciseHistoryItem = (props: Props) => {
  const { exercise, maxSetId, maxRepId, todayString } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {getDatePrettyFormat(exercise.date, todayString)}
      </Text>
      {exercise.sets.map((set, index) => (
        <SetItem
          key={set.id}
          set={set}
          index={index}
          unit={exercise.weight_unit}
          maxSetId={maxSetId}
          maxRepId={maxRepId}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  date: {
    paddingBottom: 12,
  },
});

export default React.memo<Props>(
  ExerciseHistoryItem,
  (prevProps, nextProps) => {
    if (
      prevProps.maxSetId !== nextProps.maxSetId ||
      prevProps.maxRepId !== nextProps.maxRepId ||
      prevProps.todayString !== nextProps.todayString
    ) {
      return false;
    }

    return (
      // Doing it like this because of Realm
      JSON.stringify(prevProps.exercise) === JSON.stringify(nextProps.exercise)
    );
  }
);
