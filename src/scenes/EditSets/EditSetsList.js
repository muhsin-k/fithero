/* @flow */

import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import useRealmResultsHook from '../../components/useRealmResultsHook';
import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../../database/types';
import {
  getMaxRepByType,
  getMaxSetByType,
} from '../../database/services/WorkoutSetService';
import EditSetItem from './EditSetItem';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';

type Props = {
  exercise: ?WorkoutExerciseSchemaType,
  unit: DefaultUnitSystemType,
  selectedId: string,
  onPressItem: (setId: string) => void,
};

const EditSetsList = (props: Props) => {
  const { exercise, unit, onPressItem, selectedId } = props;

  const { data: maxSets } = useRealmResultsHook<WorkoutSetSchemaType>(
    React.useCallback(() => {
      if (exercise && exercise.isValid()) {
        // It's possible that we delete the whole exercise so this access to .sets would be invalid
        return getMaxSetByType(exercise.type);
      }
    }, [exercise])
  );
  const { data: maxReps } = useRealmResultsHook<WorkoutSetSchemaType>(
    React.useCallback(() => {
      if (exercise && exercise.isValid()) {
        return getMaxRepByType(exercise.type);
      }
    }, [exercise])
  );

  const maxSetId = maxSets.length > 0 ? maxSets[0].id : null;
  const maxRepId = maxReps.length > 0 ? maxReps[0].id : null;

  return (
    <FlatList
      contentContainerStyle={styles.list}
      // It's possible that we delete the whole exercise so this access to .sets would be invalid
      data={exercise && exercise.isValid() ? exercise.sets : []}
      keyExtractor={item => item.id}
      renderItem={propsData =>
        _renderItem(
          propsData,
          unit,
          selectedId,
          onPressItem,
          maxSetId,
          maxRepId
        )
      }
      keyboardShouldPersistTaps="always"
      ItemSeparatorComponent={() => <Divider />}
    />
  );
};

const _renderItem = (
  { item, index },
  unit,
  selectedId,
  onPressItem,
  maxSetId,
  maxRepId
) => {
  const maxSetType =
    maxSetId === item.id ? 'maxSet' : maxRepId === item.id ? 'maxRep' : null;
  return (
    <EditSetItem
      set={item}
      index={index + 1}
      isSelected={selectedId === item.id}
      maxSetType={maxSetType}
      onPressItem={onPressItem}
      unit={unit}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 12,
  },
});

export default EditSetsList;
