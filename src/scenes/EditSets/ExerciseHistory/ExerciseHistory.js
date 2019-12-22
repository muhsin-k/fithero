/* @flow */

import React, { useCallback, useEffect, useState } from 'react';
import { VirtualizedList, Platform, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import useRealmResultsHook from '../../../hooks/useRealmResultsHook';
import {
  getExercisesByType,
  getWorkoutExerciseById,
} from '../../../database/services/WorkoutExerciseService';
import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../../../database/types';
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
import {
  deserializeWorkoutExercise,
  getExerciseSchemaIdFromSet,
} from '../../../database/utils';
import useMaxSetHook from '../../../hooks/useMaxSetHook';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../../database/constants';

type Props = {
  navigation: NavigationType<{
    day: string,
    exerciseKey: string,
    exerciseName?: string,
  }>,
};

// On Android as the tab is always rendered, we gotta do some more optimizations
const debounceTime =
  Platform.OS === 'android' ? REALM_DEFAULT_DEBOUNCE_VALUE : 0;

const ExerciseHistory = (props: Props) => {
  const type = props.navigation.state.params.exerciseKey;
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );

  const [maxSetUnit, setMaxSetUnit] = useState(defaultUnitSystem);
  const [maxRepUnit, setMaxRepUnit] = useState(defaultUnitSystem);

  const { data, timestamp } = useRealmResultsHook<WorkoutExerciseSchemaType>({
    query: useCallback(() => getExercisesByType(type), [type]),
    debounceTime,
  });

  const maxSet: ?WorkoutSetSchemaType = useMaxSetHook(
    type,
    getMaxSetByType,
    debounceTime
  );
  const maxRep: ?WorkoutSetSchemaType = useMaxSetHook(
    type,
    getMaxRepByType,
    debounceTime
  );

  const todayString = dateToString(getToday());
  // $FlowFixMe type it better
  const maxSetId = maxSet && maxSet.isValid() ? maxSet.id : null;
  // $FlowFixMe type it better
  const maxRepId = maxRep && maxRep.isValid() ? maxRep.id : null;

  const updateWeightUnit = useCallback((setId, setWeightUnit) => {
    if (!setId) {
      return;
    }
    const data = getWorkoutExerciseById(getExerciseSchemaIdFromSet(setId));
    if (data.length > 0) {
      setWeightUnit(data[0].weight_unit);
    }
  }, []);

  // TODO This might not be necessary in the future if we add weight_unit to each Set
  useEffect(() => {
    updateWeightUnit(maxSetId, setMaxSetUnit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxSetId, defaultUnitSystem]);

  // TODO This might not be necessary in the future if we add weight_unit to each Set
  useEffect(() => {
    updateWeightUnit(maxRepId, setMaxRepUnit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxRepId, defaultUnitSystem]);

  const renderItem = useCallback(
    ({ item }) => {
      if (!item.isValid()) {
        return null;
      }
      return (
        <Card style={styles.card}>
          <ExerciseHistoryItem
            // Deserialize so memo works
            exercise={deserializeWorkoutExercise(item)}
            maxSetId={maxSetId}
            maxRepId={maxRepId}
            todayString={todayString}
          />
        </Card>
      );
    },
    [maxRepId, maxSetId, todayString]
  );

  const getItem = useCallback((data, index) => {
    if (data.isValid()) {
      return data[index].isValid() ? data[index] : null;
    }
    return null;
  }, []);

  const getItemCount = useCallback(data => {
    if (data.isValid()) {
      return data.length;
    }
    return 0;
  }, []);

  return (
    <VirtualizedList
      data={data}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      renderItem={renderItem}
      extraData={timestamp}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      ListEmptyComponent={renderEmptyView}
      ListHeaderComponent={
        // $FlowFixMe type it better
        maxSet && maxSet.isValid() && maxRep && maxRep.isValid() ? (
          <PersonalRecords
            maxSet={maxSet}
            maxRep={maxRep}
            maxSetUnit={maxSetUnit}
            maxRepUnit={maxRepUnit}
          />
        ) : null
      }
      getItem={getItem}
      getItemCount={getItemCount}
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

export default ExerciseHistory;
