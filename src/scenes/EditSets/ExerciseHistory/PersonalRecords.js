/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, withTheme } from 'react-native-paper';

import i18n from '../../../utils/i18n';
import PersonalRecordItem from './PersonalRecordItem';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import type { WorkoutSetSchemaType } from '../../../database/types';
import type { ThemeType } from '../../../utils/theme/withTheme';

type Props = {
  unit: DefaultUnitSystemType,
  maxSet: WorkoutSetSchemaType,
  maxRep: WorkoutSetSchemaType,
  theme: ThemeType,
};

const PersonalRecords = ({ maxSet, maxRep, unit, theme }: Props) => {
  const { colors } = theme;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('personal_records')}</Text>
      <View style={styles.recordsContainer}>
        <PersonalRecordItem set={maxSet} unit={unit} colors={colors} />
        <PersonalRecordItem set={maxRep} unit={unit} colors={colors} last />
      </View>
      <Text>{i18n.t('history')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  title: {
    paddingBottom: 12,
  },
  recordsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 16,
  },
});

export default withTheme(PersonalRecords);
