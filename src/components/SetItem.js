/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import i18n from '../utils/i18n';
import { toLb, toTwoDecimals } from '../utils/metrics';
import type { WorkoutSetSchemaType } from '../database/types';
import type { DefaultUnitSystemType } from '../redux/modules/settings';
import type { ThemeType } from '../utils/theme/withTheme';
import withTheme from '../utils/theme/withTheme';

type Props = {
  set: WorkoutSetSchemaType,
  maxSetId: ?string,
  maxRepId: ?string,
  index: number,
  unit: DefaultUnitSystemType,
  theme: ThemeType,
};

const SetItem = (props: Props) => {
  const { set, maxSetId, maxRepId, index, unit } = props;
  const { colors } = props.theme;

  const isMaxSet = maxSetId === set.id;
  const isMaxRep = maxRepId === set.id;
  const color = isMaxSet
    ? colors.trophy
    : isMaxRep
    ? colors.trophyReps
    : colors.text;

  return (
    <View style={styles.setRow}>
      <Text style={[styles.setIndex, { color }]}>{`${index + 1}.`}</Text>
      <Text style={[styles.setWeight, { color }]}>
        {unit === 'metric'
          ? `${i18n.t('kg.value', {
              count: toTwoDecimals(set.weight),
            })}`
          : `${toTwoDecimals(toLb(set.weight))} ${i18n.t('lb')}`}
      </Text>
      <Text style={[styles.setReps, { color }]}>{`${i18n.t('reps.value', {
        count: set.reps,
      })}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  setRow: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  setIndex: {
    flex: 0.08,
    paddingRight: 8,
  },
  setWeight: {
    flex: 0.25,
    textAlign: 'right',
    paddingRight: 8,
  },
  setReps: {
    flex: 0.25,
    textAlign: 'right',
  },
});

export default withTheme(SetItem);
