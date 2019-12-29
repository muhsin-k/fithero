/* @flow */

import React from 'react';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { getDatePrettyFormat } from '../../utils/date';
import { StyleSheet, View } from 'react-native';
import CopyWorkoutItemRow from './CopyWorkoutItemRow';
import type { WorkoutSchemaType } from '../../database/types';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';

type Props = {|
  workout: WorkoutSchemaType,
  todayString: string,
  selected: boolean,
  theme: ThemeType,
|};

const CopyWorkoutItem = ({ workout, todayString, selected, theme }: Props) => {
  const { colors } = theme;
  return (
    <View style={styles.container}>
      <Icon
        name="check"
        size={28}
        color={colors.accent}
        style={[styles.checkIcon, selected && styles.selected]}
      />
      <View style={styles.firstRow}>
        <Text style={styles.date}>
          {getDatePrettyFormat(workout.date, todayString)}
        </Text>
      </View>
      {workout.exercises.map(e => (
        <CopyWorkoutItemRow key={e.id} exercise={e} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  checkIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0,
  },
  selected: {
    opacity: 1,
  },
});

export default withTheme(
  React.memo<Props>(CopyWorkoutItem, (prevProps, nextProps) => {
    return prevProps.selected === nextProps.selected;
  })
);
