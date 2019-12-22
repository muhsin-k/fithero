/* @flow */

import * as React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import type {
  WorkoutExerciseSchemaType,
  WorkoutSetSchemaType,
} from '../../database/types';
import EditSetsInputControls from './EditSetsInputControls';
import i18n from '../../utils/i18n';
import EditSetActionButtons from './EditSetActionButtons';
import {
  deserializeWorkoutExercise,
  extractSetIndexFromDatabase,
  getExerciseSchemaId,
  getSetSchemaId,
} from '../../database/utils';
import {
  addSet,
  deleteSet,
  getLastSetByType,
  updateSet,
} from '../../database/services/WorkoutSetService';
import { addExercise } from '../../database/services/WorkoutExerciseService';
import { toDate } from '../../utils/date';
import {
  getWeight,
  getWeightUnit,
  toKg,
  toTwoDecimals,
} from '../../utils/metrics';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import EditSetsList from './EditSetsList';

type Props = {
  day: string,
  defaultUnitSystem: DefaultUnitSystemType,
  exerciseKey: string,
  exercise: ?WorkoutExerciseSchemaType,
};

type State = {
  weight: string,
  reps: string,
  selectedId: string,
};

type ActionIncDec = (property: string, value: number) => void;

export class EditSetsWithControls extends React.Component<Props, State> {
  weightDec: ActionIncDec;
  weightInc: ActionIncDec;
  repsDec: ActionIncDec;
  repsInc: ActionIncDec;
  isAddingExercise: boolean;

  constructor(props: Props) {
    super(props);
    this.weightDec = this.handleIncDec.bind(this, 'weight', -1);
    this.weightInc = this.handleIncDec.bind(this, 'weight', +1);

    this.repsDec = this.handleIncDec.bind(this, 'reps', -1);
    this.repsInc = this.handleIncDec.bind(this, 'reps', +1);

    const lastSet = this._getLastSet(props, '');
    this.state = {
      weight: this._getInputWeight(props, lastSet),
      reps: lastSet ? lastSet.reps.toString() : '8',
      selectedId: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.defaultUnitSystem !== this.props.defaultUnitSystem) {
      const lastSet = this._getLastSet(nextProps, this.state.selectedId);
      this.setState({
        weight: this._getInputWeight(nextProps, lastSet),
      });
    }
    if (this.isAddingExercise && nextProps.exercise) {
      this.isAddingExercise = false;
    }
  }

  _getLastSet(props: Props, selectedId?: string) {
    let lastSet = null;
    if (!selectedId) {
      if (props.exercise) {
        lastSet = props.exercise.sets[props.exercise.sets.length - 1];
      } else {
        const sets = getLastSetByType(
          this.props.exerciseKey || this.props.exercise?.type
        );
        if (sets.length > 0) {
          lastSet = sets[0];
        }
      }
    } else if (props.exercise) {
      const sets = props.exercise.sets;
      lastSet = sets[sets.findIndex(s => s.id === selectedId)];
    }
    return lastSet;
  }

  _getInputWeight(props: Props, lastSet: ?WorkoutSetSchemaType) {
    const defaultWeight = props.defaultUnitSystem === 'metric' ? 20 : 45;

    const lastWeight = lastSet
      ? toTwoDecimals(
          getWeight(lastSet.weight, props.exercise, props.defaultUnitSystem)
        )
      : defaultWeight;

    return lastWeight.toString();
  }

  onBackButtonPressAndroid = () => {
    if (this.state.selectedId) {
      this.setState({ selectedId: '' });
      return true;
    }
    return false;
  };

  handleIncDec = (property: string, value: number) => {
    const currentValue =
      this.state[property] >= '0' ? this.state[property] : '0';
    const parsedValue =
      property === 'weight'
        ? parseFloat(currentValue)
        : parseInt(currentValue, 10);
    const newValue = (parsedValue + value).toString();
    this.setState({ [property]: newValue > '0' ? newValue : '0' });
  };

  _onChangeWeightInput = (value: string) => {
    const parsedValue = value.replace(',', '.');
    // TODO handle comma correctly depending on the locale (save it using dot but showing it using comma)
    if (value === '-' || !isNaN(parsedValue)) {
      this.setState({
        weight: parsedValue,
      });
    }
  };

  _onChangeRepsInput = (value: string) => {
    this.setState({
      reps: value === '' || parseInt(value, 10) >= 0 ? value : '0',
    });
  };

  _onPressItem = (setId: string) => {
    if (this.state.selectedId === setId) {
      this.setState({ selectedId: '' });
      return;
    }
    if (this.props.exercise) {
      const { sets } = this.props.exercise;
      const set = sets.find(s => s.id === setId);
      if (set) {
        this.setState({
          selectedId: setId,
          weight: toTwoDecimals(
            getWeight(
              set.weight,
              this.props.exercise,
              this.props.defaultUnitSystem
            )
          ).toString(),
          reps: set.reps.toString(),
        });
      }
    }
  };

  _onAddSet = () => {
    const { day, defaultUnitSystem, exerciseKey, exercise } = this.props;
    const {
      reps: repsToConvert,
      selectedId,
      weight: weightToConvert,
    } = this.state;

    let newExercise = null;

    Keyboard.dismiss();

    const unit = getWeightUnit(exercise, defaultUnitSystem);
    let weight = 0;
    if (weightToConvert !== '' && !isNaN(weightToConvert)) {
      weight =
        unit === 'metric'
          ? parseFloat(weightToConvert)
          : toKg(parseFloat(weightToConvert));
    }

    const reps = repsToConvert ? parseInt(repsToConvert, 10) : 0;

    if (!exercise) {
      const exerciseIdDb = getExerciseSchemaId(day, exerciseKey);
      const date = toDate(day);
      newExercise = {
        id: exerciseIdDb,
        sets: [
          {
            id: getSetSchemaId(day, exerciseKey, 1),
            weight,
            reps,
            date,
            type: exerciseKey,
          },
        ],
        date,
        type: exerciseKey,
        weight_unit: defaultUnitSystem,
      };
      // If the user presses very fast it can try to create a duplicated primary key
      if (this.isAddingExercise) {
        return;
      }
      this.isAddingExercise = true;
      addExercise(newExercise);
    } else if (!selectedId) {
      const lastId = exercise.sets[exercise.sets.length - 1].id;
      const lastIndex = extractSetIndexFromDatabase(lastId);

      addSet({
        id: getSetSchemaId(day, exerciseKey, lastIndex + 1),
        weight,
        reps,
        date: toDate(day),
        type: exerciseKey,
      });
    } else if (selectedId) {
      updateSet({
        id: selectedId,
        weight,
        reps,
        date: toDate(day),
        type: exerciseKey,
      });
    }

    if (selectedId) {
      this.setState({ selectedId: '' });
    }
  };

  _onDeleteSet = () => {
    const { selectedId } = this.state;

    Keyboard.dismiss();

    deleteSet(selectedId);
    this.setState({ selectedId: '' });
  };

  render() {
    const { defaultUnitSystem, exercise } = this.props;
    const { reps, selectedId, weight } = this.state;

    const unit = getWeightUnit(exercise, defaultUnitSystem);

    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <EditSetsInputControls
                input={weight}
                label={i18n.t('weight_label', {
                  w:
                    unit === 'metric'
                      ? i18n.t('kg.unit', { count: 10 })
                      : i18n.t('lb'),
                })}
                onChangeText={this._onChangeWeightInput}
                controls={[
                  { icon: 'remove', action: this.weightDec },
                  { icon: 'add', action: this.weightInc },
                ]}
                keyboardType="numeric"
                containerStyle={[
                  styles.weightContainer,
                  styles.weightSeparation,
                ]}
                labelStyle={styles.weightSeparation}
              />
              <EditSetsInputControls
                input={reps}
                label={i18n.t('reps.title')}
                onChangeText={this._onChangeRepsInput}
                controls={[
                  { icon: 'remove', action: this.repsDec },
                  { icon: 'add', action: this.repsInc },
                ]}
                keyboardType="number-pad"
                containerStyle={[styles.repsContainer, styles.repsSeparation]}
                labelStyle={styles.repsSeparation}
              />
            </View>
            <EditSetActionButtons
              isUpdate={!!selectedId}
              onAddSet={this._onAddSet}
              onDeleteSet={this._onDeleteSet}
            />
          </Card>
          <EditSetsList
            exercise={
              // It's possible that we delete the whole exercise so this access to .sets would be invalid
              exercise && exercise.isValid()
                ? deserializeWorkoutExercise(exercise)
                : null
            }
            unit={unit}
            onPressItem={this._onPressItem}
            selectedId={selectedId}
            type={this.props.exerciseKey}
          />
        </View>
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  weightContainer: {
    flex: 1,
  },
  repsContainer: {
    flex: 0.9,
  },
  weightSeparation: {
    paddingRight: 8,
  },
  repsSeparation: {
    paddingLeft: 8,
  },
});

export default EditSetsWithControls;
