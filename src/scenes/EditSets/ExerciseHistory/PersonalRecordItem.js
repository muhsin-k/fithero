/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import i18n from '../../../utils/i18n';
import { formatDate, isSameYear, isToday } from '../../../utils/date';
import { toLb, toTwoDecimals } from '../../../utils/metrics';
import withTheme from '../../../utils/theme/withTheme';
import type { WorkoutSetSchemaType } from '../../../database/types';
import type { ThemeType } from '../../../utils/theme/withTheme';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';

type Props = {|
  set: WorkoutSetSchemaType,
  theme: ThemeType,
  trophyColor: string,
  unit: DefaultUnitSystemType,
  last?: boolean,
|};

const PersonalRecordItem = ({ theme, set, unit, trophyColor, last }: Props) => {
  // $FlowFixMe type it better
  if (!set.isValid()) {
    return null;
  }

  const { colors } = theme;
  const unitText =
    unit === 'metric'
      ? i18n.t('kg.unit', { count: Math.floor(set.weight) })
      : i18n.t('lb');
  const repsText = i18n.t('reps.unit', { count: set.reps });

  return (
    <Card style={[styles.card, !last && styles.cardSeparator]}>
      <View>
        <View style={styles.row}>
          <Text style={styles.recordDate}>
            {isToday(set.date)
              ? i18n.t('today')
              : formatDate(set.date, isSameYear(set.date) ? 'MMM D' : 'YYYY')}
          </Text>
          <Icon name="trophy" size={24} color={trophyColor} />
        </View>
        <Text style={[styles.singleNumber, { color: colors.text }]}>
          {toTwoDecimals(unit === 'metric' ? set.weight : toLb(set.weight))}{' '}
          <Text style={[styles.unit, { color: colors.secondaryText }]}>
            {`${unitText} x `}
          </Text>
          <Text style={{ color: colors.text }}>
            {`${set.reps} `}
            <Text style={[styles.unit, { color: colors.secondaryText }]}>
              {repsText}
            </Text>
          </Text>
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
  },
  cardSeparator: {
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordDate: {
    marginBottom: 12,
  },
  singleNumber: {
    fontSize: 18,
  },
  unit: {
    fontSize: 14,
  },
});

export default withTheme(PersonalRecordItem);
