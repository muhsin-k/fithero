/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { getDatePrettyFormat } from '../../../utils/date';
import type { WorkoutExerciseSchemaType } from '../../../database/types';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import SetItem from '../../../components/SetItem';

type Props = {
  exercise: WorkoutExerciseSchemaType,
  maxSetId: ?string,
  maxRepId: ?string,
  unit: DefaultUnitSystemType,
  todayString: string,
};

class ExerciseHistoryItem extends React.PureComponent<Props> {
  render() {
    const { exercise, unit, maxSetId, maxRepId, todayString } = this.props;

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
            unit={unit}
            maxSetId={maxSetId}
            maxRepId={maxRepId}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  date: {
    paddingBottom: 12,
  },
});

export default ExerciseHistoryItem;
