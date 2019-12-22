/* @flow */

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import DayItem from './DayItem';
import {
  dateToString,
  dateToWorkoutId,
  getDatePrettyFormat,
  getToday,
} from '../../utils/date';
import { useSelector } from 'react-redux';

type Props = {|
  currentWeek: Array<Date>,
|};

const DayRow = (props: Props) => {
  const { currentWeek } = props;
  const selectedDay = useSelector(state => state.home.selectedDay);

  const renderDays = useMemo(() => {
    return currentWeek.map(d => {
      const dateString = dateToWorkoutId(d);
      return <DayItem key={dateString} dateString={dateString} />;
    });
  }, [currentWeek]);

  return (
    <>
      <Text style={styles.title}>
        {getDatePrettyFormat(selectedDay, dateToString(getToday()))}
      </Text>
      <View style={styles.row}>{renderDays}</View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default DayRow;
