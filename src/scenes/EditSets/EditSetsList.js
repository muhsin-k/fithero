/* @flow */

import React, { useCallback, useState, memo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../../database/types';
import EditSetItem from './EditSetItem';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import useKeyboard from '../../hooks/useKeyboard';
import useMaxSetHook from '../../hooks/useMaxSetHook';
import {
  getMaxRepByType,
  getMaxSetByType,
} from '../../database/services/WorkoutSetService';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../database/constants';

type Props = {|
  exercise: ?WorkoutExerciseSchemaType,
  unit: DefaultUnitSystemType,
  selectedId: string,
  onPressItem: (setId: string) => void,
  type: string,
|};

const EditSetsList = (props: Props) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { exercise, unit, onPressItem, selectedId, type } = props;
  const data = exercise ? exercise.sets : [];

  const keyboardCallback = useCallback(height => {
    setKeyboardHeight(height > 0 ? height : 0);
  }, []);

  useKeyboard(keyboardCallback);

  const maxSet: ?WorkoutSetSchemaType = useMaxSetHook(
    type,
    getMaxSetByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );
  const maxRep: ?WorkoutSetSchemaType = useMaxSetHook(
    type,
    getMaxRepByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );

  const maxSetId = maxSet ? maxSet.id : null;
  const maxRepId = maxRep ? maxRep.id : null;

  const renderItem = useCallback(
    ({ item, index }) => {
      const maxSetType =
        maxSetId === item.id
          ? 'maxSet'
          : maxRepId === item.id
          ? 'maxRep'
          : null;
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
    },
    [maxRepId, maxSetId, onPressItem, selectedId, unit]
  );

  return (
    <>
      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <Divider />}
      />
      <View style={{ height: keyboardHeight }} />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 12,
  },
});

export default memo<Props>(EditSetsList, (prevProps, nextProps) => {
  if (
    prevProps.selectedId !== nextProps.selectedId ||
    prevProps.onPressItem !== nextProps.onPressItem ||
    prevProps.type !== nextProps.type ||
    prevProps.unit !== nextProps.unit
  ) {
    return false;
  }

  return (
    // Doing it like this because of Realm
    JSON.stringify(prevProps.exercise) === JSON.stringify(nextProps.exercise)
  );
});
