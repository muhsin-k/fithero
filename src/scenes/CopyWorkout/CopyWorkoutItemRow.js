/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { getExerciseName } from '../../utils/exercises';
import {
  getExerciseObjectByPrimaryId,
  isCustomExercise,
} from '../../database/services/ExerciseService';
import { extractExerciseKeyFromDatabase } from '../../database/utils';
import type { WorkoutExerciseSchemaType } from '../../database/types';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';
import i18n from '../../utils/i18n';
import { toLb, toTwoDecimals } from '../../utils/metrics';

type Props = {
  exercise: WorkoutExerciseSchemaType,
  theme: ThemeType,
};

const CopyWorkoutItemRow = ({ exercise, theme }: Props) => {
  const { colors } = theme;
  const defaultUnitSystem = useSelector(
    state => state.settings.defaultUnitSystem
  );

  let customExerciseName = '';
  if (isCustomExercise(exercise.id)) {
    const customExercises = getExerciseObjectByPrimaryId(
      extractExerciseKeyFromDatabase(exercise.id)
    );
    customExerciseName = customExercises.name;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {getExerciseName(exercise.type, customExerciseName)}
      </Text>
      <Text style={styles.row} numberOfLines={1} ellipsizeMode="tail">
        {exercise.sets.map(set => (
          <Text key={set.id} style={{ color: colors.secondaryText }}>{`${
            exercise.weight_unit === 'metric'
              ? toTwoDecimals(set.weight)
              : toTwoDecimals(toLb(set.weight))
          }x${set.reps} `}</Text>
        ))}
        {defaultUnitSystem !== exercise.weight_unit && (
          <Text>{` (${
            exercise.weight_unit === 'metric'
              ? i18n.t('kg.unit', { count: 1 })
              : i18n.t('lb')
          })`}</Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  name: {
    paddingBottom: 4,
  },
});

export default withTheme(React.memo<Props>(CopyWorkoutItemRow));
