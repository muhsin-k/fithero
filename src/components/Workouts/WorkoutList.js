/* @flow */

import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { VirtualizedList, View } from 'react-native';

import type { WorkoutSchemaType } from '../../database/types';
import WorkoutItem from './WorkoutItem';
import WorkoutEmptyView from './WorkoutEmptyView';
import { deserializeWorkoutExercise } from '../../database/utils';

type Props = {
  dayString: string,
  contentContainerStyle?: View.propTypes.style,
  onPressItem: (exerciseKey: string, customExerciseName: ?string) => void,
  workout: ?WorkoutSchemaType,
};

const WorkoutList = (props: Props) => {
  const { dayString, onPressItem, workout, ...rest } = props;

  const renderEmptyView = useMemo(() => {
    if (
      !workout ||
      (workout &&
        workout.isValid() &&
        workout.exercises &&
        // $FlowFixMe
        workout.exercises.isValid() &&
        (workout.exercises.length === 0 && !workout.comments))
    ) {
      return <WorkoutEmptyView dayString={dayString} />;
    }
    return null;
  }, [dayString, workout]);

  const renderItem = useCallback(
    ({ item }) => {
      if (!item.isValid()) {
        // We might have deleted the whole user exercise
        return null;
      }

      return (
        <WorkoutItem
          // Deserialize so memo works
          exercise={deserializeWorkoutExercise(item)}
          onPressItem={onPressItem}
        />
      );
    },
    [onPressItem]
  );

  const getItem = useCallback((data, index) => {
    if (data.isValid && data.isValid()) {
      return data[index].isValid() ? data[index] : null;
    }
    return null;
  }, []);

  const getItemCount = useCallback(data => {
    if (data && data.isValid && data.isValid()) {
      return data.length;
    }
    return 0;
  }, []);

  return (
    <VirtualizedList
      data={
        workout &&
        workout.isValid() &&
        workout.exercises &&
        // $FlowFixMe
        workout.exercises.isValid()
          ? workout.exercises
          : []
      }
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyView}
      getItem={getItem}
      getItemCount={getItemCount}
      {...rest}
    />
  );
};

export default WorkoutList;
