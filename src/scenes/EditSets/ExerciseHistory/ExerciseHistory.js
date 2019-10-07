/* @flow */

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import useRealmResultsHook from '../../../components/useRealmResultsHook';
import {
  getExercisesByType,
  getWorkoutExerciseById,
} from '../../../database/services/WorkoutExerciseService';
import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../../../database/types';
import { connect } from 'react-redux';
import ExerciseHistoryItem from './ExerciseHistoryItem';
import {
  getMaxRepByType,
  getMaxSetByType,
} from '../../../database/services/WorkoutSetService';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import type { NavigationType } from '../../../types';
import { dateToString, getToday } from '../../../utils/date';
import i18n from '../../../utils/i18n';
import PersonalRecords from './PersonalRecords';
import { getWeightUnit } from '../../../utils/metrics';
import { getExerciseSchemaIdFromSet } from '../../../database/utils';

type Props = {
  type: 'string',
  defaultUnitSystem: DefaultUnitSystemType,
  navigation: NavigationType<{
    exerciseKey: string,
  }>,
};

const ExerciseHistory = (props: Props) => {
  const type = props.navigation.state.params.exerciseKey;

  const [maxSetUnit, setMaxSetUnit] = useState(props.defaultUnitSystem);
  const [maxRepUnit, setMaxRepUnit] = useState(props.defaultUnitSystem);

  const { data, timestamp } = useRealmResultsHook<WorkoutExerciseSchemaType>(
    useCallback(() => getExercisesByType(type), [type])
  );

  const {
    data: maxSets,
    timestamp: maxSetHasChanged,
  } = useRealmResultsHook<WorkoutSetSchemaType>(
    useCallback(() => getMaxSetByType(type), [type])
  );

  const {
    data: maxReps,
    timestamp: maxRepHasChanged,
  } = useRealmResultsHook<WorkoutSetSchemaType>(
    useCallback(() => getMaxRepByType(type), [type])
  );

  // This might not be necessary in the future if we add weight_unit to each Set
  useEffect(() => {
    if (maxSets.length > 0) {
      const data = getWorkoutExerciseById(
        getExerciseSchemaIdFromSet(maxSets[0].id)
      );
      if (data.length > 0) setMaxSetUnit(data[0].weight_unit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxSetHasChanged, props.defaultUnitSystem]);

  // This might not be necessary in the future if we add weight_unit to each Set
  useEffect(() => {
    if (maxReps.length > 0) {
      const data = getWorkoutExerciseById(
        getExerciseSchemaIdFromSet(maxReps[0].id)
      );
      if (data.length > 0) setMaxRepUnit(data[0].weight_unit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxRepHasChanged, props.defaultUnitSystem]);

  const todayString = dateToString(getToday());
  const maxSetId = maxSets.length > 0 ? maxSets[0].id : null;
  const maxRepId = maxReps.length > 0 ? maxReps[0].id : null;

  const maxSet = maxSetId ? maxSets[0] : null;
  const maxRep = maxRepId ? maxReps[0] : null;

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <ExerciseHistoryItem
            exercise={item}
            unit={getWeightUnit(item, props.defaultUnitSystem)}
            maxSetId={maxSetId}
            maxRepId={maxRepId}
            todayString={todayString}
          />
        </Card>
      )}
      extraData={timestamp}
      ListEmptyComponent={renderEmptyView}
      ListHeaderComponent={
        maxSet && maxRep ? (
          <PersonalRecords
            maxSet={maxSet}
            maxRep={maxRep}
            maxSetUnit={maxSetUnit}
            maxRepUnit={maxRepUnit}
          />
        ) : null
      }
    />
  );
};

const keyExtractor = exercise => exercise.id;

const renderEmptyView = () => (
  <View style={styles.emptyContainer}>
    <Text>{i18n.t('empty_view__history')}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  emptyContainer: {
    padding: 16,
  },
});

export default connect(
  state => ({
    defaultUnitSystem: state.settings.defaultUnitSystem,
  }),
  null
)(ExerciseHistory);
