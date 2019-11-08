/* @flow */

import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import type { WorkoutExerciseSchemaType } from '../../database/types';
import EditSetItem from './EditSetItem';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import useMaxSetsHook from '../../components/useMaxSetsHook';
import useKeyboard from '../../components/useKeyboard';

type Props = {
  exercise: ?WorkoutExerciseSchemaType,
  unit: DefaultUnitSystemType,
  selectedId: string,
  onPressItem: (setId: string) => void,
};

const EditSetsList = (props: Props) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { exercise, unit, onPressItem, selectedId } = props;
  // It's possible that we delete the whole exercise so this access to .sets would be invalid
  const data = exercise && exercise.isValid() ? exercise.sets : [];

  const keyboardCallback = useCallback(height => {
    setKeyboardHeight(height > 0 ? height : 0);
  }, []);

  useKeyboard(keyboardCallback);

  const [maxSets, maxReps] = useMaxSetsHook(exercise);
  const maxSetId = maxSets.length > 0 ? maxSets[0].id : null;
  const maxRepId = maxReps.length > 0 ? maxReps[0].id : null;

  return (
    <>
      <FlatList
        contentContainerStyle={styles.list}
        data={data}
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
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <Divider />}
      />
      <View style={{ height: keyboardHeight }} />
    </>
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
