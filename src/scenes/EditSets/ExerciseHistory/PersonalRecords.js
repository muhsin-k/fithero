/* @flow */

import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text, withTheme } from 'react-native-paper';

import i18n from '../../../utils/i18n';
import PersonalRecordItem from './PersonalRecordItem';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import type { WorkoutSetSchemaType } from '../../../database/types';
import type { ThemeType } from '../../../utils/theme/withTheme';

type Props = {
  maxSet: WorkoutSetSchemaType,
  maxRep: WorkoutSetSchemaType,
  maxSetUnit: DefaultUnitSystemType,
  maxRepUnit: DefaultUnitSystemType,
  theme: ThemeType,
};

const PersonalRecords = ({
  maxSet,
  maxRep,
  maxSetUnit,
  maxRepUnit,
  theme,
}: Props) => {
  const { colors } = theme;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('personal_records')}</Text>
      <View style={styles.recordsContainer}>
        <PersonalRecordItem
          set={maxSet}
          unit={maxSetUnit}
          trophyColor={colors.trophy}
        />
        <PersonalRecordItem
          set={maxRep}
          unit={maxRepUnit}
          trophyColor={colors.trophyReps}
          last
        />
      </View>
      <Text>{i18n.t('history')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 8 : 12,
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
