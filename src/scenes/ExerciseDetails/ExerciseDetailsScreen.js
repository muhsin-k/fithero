/* @flow */

import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Paragraph, Caption, Title } from 'react-native-paper';
import { exercises } from 'fithero-exercises';
import memoize from 'lodash/memoize';

import {
  deleteExercise,
  getExerciseById,
  isCustomExercise,
} from '../../database/services/ExerciseService';
import type { ExerciseSchemaType } from '../../database/types';
import { getExerciseMuscleName, getExerciseName } from '../../utils/exercises';
import i18n from '../../utils/i18n';
import HeaderIconButton from '../../components/Header/HeaderIconButton';
import HeaderOverflowButton from '../../components/Header/HeaderOverflowButton';
import type { NavigationType } from '../../types';
import DeleteWarningDialog from '../../components/DeleteWarningDialog';
import Screen from '../../components/Screen';
import type { AppThemeType } from '../../redux/modules/settings';
import { getDefaultNavigationOptions } from '../../utils/navigation';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';

const getExercise = memoize(id => exercises.find(e => e.id === id));

type NavigationObjectType = {
  navigation: NavigationType<{
    id: string,
    editAction: () => void,
    deleteAction: (i: number) => void,
  }>,
};

type NavigationOptions = NavigationObjectType & {
  screenProps: {
    theme: AppThemeType,
  },
};

type Props = NavigationObjectType & {};

const ExerciseDetailsScreen = (props: Props) => {
  const { navigation } = props;
  const { params = {} } = props.navigation.state;
  const id = params.id;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    navigation.setParams({
      editAction: () => {
        navigation.navigate('EditExercise', {
          id,
        });
      },
    });
    navigation.setParams({ deleteAction: () => setShowDeleteDialog(true) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDeleting) {
      deleteExercise(id);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isDeleting]);

  const { data: customExercises } = useRealmResultsHook<ExerciseSchemaType>({
    query: useCallback(() => {
      if (isCustomExercise(id)) {
        return getExerciseById(id);
      }
    }, [id]),
  });

  const exercise =
    customExercises.length > 0 ? customExercises[0] : getExercise(id);

  if (isDeleting) {
    return null;
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView>
        <React.Fragment>
          <Title style={styles.section}>
            {getExerciseName(exercise.id, exercise.name)}
          </Title>
          {exercise.notes ? (
            <Paragraph style={styles.section}>{exercise.notes}</Paragraph>
          ) : null}
          <View style={styles.section}>
            <Caption style={styles.smallSubheading}>
              {i18n.t('primary_muscle')}
            </Caption>
            <Paragraph>
              {exercise.primary.map(m => getExerciseMuscleName(m)).join(', ')}
            </Paragraph>
          </View>
          {exercise.secondary.length > 0 && (
            <View style={styles.section}>
              <Caption style={styles.smallSubheading}>
                {i18n.t('secondary_muscle', {
                  count: exercise.secondary.length,
                })}
              </Caption>
              <Paragraph>
                {exercise.secondary
                  .map(m => getExerciseMuscleName(m))
                  .join(', ')}
              </Paragraph>
            </View>
          )}
          <DeleteWarningDialog
            title={i18n.t('delete__exercise_title')}
            description={i18n.t('delete__exercise_description')}
            onConfirm={() => setIsDeleting(true)}
            onDismiss={() => setShowDeleteDialog(false)}
            visible={showDeleteDialog}
          />
        </React.Fragment>
      </ScrollView>
    </Screen>
  );
};

ExerciseDetailsScreen.navigationOptions = ({
  navigation,
  screenProps,
}: NavigationOptions) => {
  const { params = {} } = navigation.state;

  return {
    ...getDefaultNavigationOptions(screenProps.theme),
    headerRight: isCustomExercise(params.id) ? (
      <View style={styles.toolbarActions}>
        <HeaderIconButton onPress={() => params.editAction()} icon="edit" />
        <HeaderOverflowButton
          onPress={i => params.deleteAction(i)}
          actions={[i18n.t('delete')]}
          destructiveButtonIndex={1}
          last
        />
      </View>
    ) : (
      undefined
    ),
  };
};

const styles = StyleSheet.create({
  toolbarActions: {
    flexDirection: 'row',
  },
  screen: {
    padding: 16,
  },
  section: {
    paddingBottom: 16,
  },
  smallSubheading: {
    fontSize: 14,
  },
});

export default ExerciseDetailsScreen;
