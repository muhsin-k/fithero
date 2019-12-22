/* @flow */

import React, { useCallback, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import { getShortDayInfo, isSameDay } from '../../utils/date';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDay } from '../../redux/modules/home';
import { getWorkoutById } from '../../database/services/WorkoutService';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import type { WorkoutSchemaType } from '../../database/types';

const { width } = Dimensions.get('window');

type Props = {|
  dateString: string,
  theme: ThemeType,
|};

const DayItem = (props: Props) => {
  const { dateString, theme } = props;
  const wasSelected = useRef(null);
  const selectedDay = useSelector(
    state => state.home.selectedDay,
    selectedDay => {
      const sameDay = isSameDay(dateString, selectedDay);
      if (!wasSelected.current && sameDay) {
        wasSelected.current = true;
        return false;
      }
      if (wasSelected.current && !sameDay) {
        wasSelected.current = false;
        return false;
      }
      return true;
    }
  );
  const dispatch = useDispatch();
  const textColor = theme.colors.text;

  const { date, day } = getShortDayInfo(dateString);
  const isSelected = isSameDay(dateString, selectedDay);
  const { data: workouts } = useRealmResultsHook<WorkoutSchemaType>({
    query: useCallback(() => getWorkoutById(dateString), [dateString]),
    prevFn: data => data.length,
    hasChanged: (prevData, newData) => {
      if (prevData === 0 && newData.length > 0) {
        return true;
      }
      return prevData > 0 && newData.length === 0;
    },
  });
  const isWorkout = workouts.length > 0;

  const onSelected = useCallback(() => {
    dispatch(setSelectedDay(dateString));
  }, [dateString, dispatch]);

  return (
    <TouchableRipple onPress={onSelected} testID="day-touchable">
      <View style={styles.container}>
        <View
          style={[styles.textContainer, isSelected && styles.selected]}
          testID="day-text-container"
        >
          <Text style={[styles.text, styles.textTop, textColor]}>{date}</Text>
          <Text style={[styles.text, styles.textBottom, textColor]}>{day}</Text>
        </View>
        <View style={styles.dots}>
          {isWorkout && (
            <View
              style={[styles.dot, { backgroundColor: theme.colors.accent }]}
              testID="day-dot"
            />
          )}
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    // Subtract the padding part on each item
    width: width / 7 - 16 / 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    opacity: 0.5,
  },
  selected: {
    opacity: 1,
  },
  text: {
    fontSize: 14,
  },
  textTop: {
    paddingBottom: 1,
  },
  textBottom: {
    paddingTop: 1,
  },
  dots: {
    height: 12,
    paddingVertical: 4,
  },
  dot: {
    width: 4,
    height: 4,
    marginTop: 1,
    marginLeft: 1,
    marginRight: 1,
    borderRadius: 2,
  },
});

export default withTheme(React.memo<Props>(DayItem));
