/* @flow */

import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, RadioButton } from 'react-native-paper';

import { muscleCategories } from '../../utils/muscles';
import MuscleItem from './MuscleItem';

type Props = {
  onValueChange: ({ [key: string]: boolean }) => void,
  muscles: { [key: string]: boolean },
  multiple: boolean,
};

const MuscleSelector = (props: Props) => {
  const { multiple, muscles, onValueChange } = props;

  const onMuscleChange = useCallback(
    muscleId => {
      let newValues = {};
      if (multiple) {
        newValues = {
          ...muscles,
          [muscleId]: muscles[muscleId] ? !muscles[muscleId] : true,
        };
      } else {
        newValues = {
          [muscleId]: muscles[muscleId] ? muscles[muscleId] : true,
        };
      }

      onValueChange(newValues);
    },
    [multiple, muscles, onValueChange]
  );

  const ItemComponent = props.multiple ? Checkbox : RadioButton;

  return (
    <View style={styles.row}>
      {muscleCategories.map(item => {
        return (
          <MuscleItem
            key={item.id}
            muscle={item}
            checked={
              typeof muscles === 'string'
                ? muscles === item.id
                : !!muscles[item.id]
            }
            onValueChange={onMuscleChange}
            style={styles.item}
            render={props => (
              <ItemComponent status={props.checked ? 'checked' : 'unchecked'} />
            )}
          />
        );
      })}
    </View>
  );
};

MuscleSelector.defaultProps = {
  multiple: true,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '50%',
  },
});

export default MuscleSelector;
