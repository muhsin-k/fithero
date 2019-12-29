/* @flow */

import cloneDeep from 'lodash/cloneDeep';

import { copyWorkout } from '../copyWorkout';
import realm from '../../database';
import { getWorkoutByPrimaryKey } from '../../database/services/WorkoutService';

jest.mock('../date', () => {
  const actualDate = jest.requireActual('../date');
  return {
    ...actualDate,
    toDate: () => new Date('2019-12-28T00:00:00.000Z'),
  };
});

jest.mock('../../database/services/WorkoutService');

describe('copyWorkout', () => {
  const date = new Date('2018-05-04T00:00:00.000Z');
  const workout = {
    id: '20180504',
    date,
    exercises: [
      {
        id: `20180504_bench-press`,
        date,
        type: 'bench-press',
        sort: 1,
        isValid: () => true,
        weight_unit: 'metric',
        sets: [
          {
            id: `20180504_bench-press_001`,
            reps: 5,
            weight: 100,
            date,
            type: 'bench-press',
          },
        ],
      },
      {
        id: `20180504_barbell-squat`,
        date,
        type: 'barbell-squat',
        sort: 2,
        isValid: () => true,
        weight_unit: 'metric',
        sets: [
          {
            id: `20180504_barbell-squat_004`,
            reps: 5,
            weight: 120,
            date,
            type: 'barbell-squat',
          },
          {
            id: `20180504_barbell-squat_001`,
            reps: 4,
            weight: 120,
            date,
            type: 'barbell-squat',
          },
        ],
      },
    ],
    isValid: () => true,
  };

  const existingDate = new Date('2019-12-28T00:00:00.000Z');
  const existingWorkout = {
    id: '20191228',
    date: existingDate,
    exercises: [
      {
        id: `20191228_barbell-squat`,
        date: existingDate,
        type: 'barbell-squat',
        sort: 1,
        isValid: () => true,
        weight_unit: 'metric',
        sets: [
          {
            id: `20191228_barbell-squat_003`,
            reps: 3,
            weight: 150,
            date: existingDate,
            type: 'barbell-squat',
          },
          {
            id: `20191228_barbell-squat_001`,
            reps: 2,
            weight: 150,
            date: existingDate,
            type: 'barbell-squat',
          },
        ],
      },
    ],
    isValid: () => true,
  };

  it('copies a workout into an empty day', () => {
    copyWorkout(workout, '20191228');
    // $FlowFixMe
    expect(workout).toMatchDiffSnapshot(realm.create.mock.calls[0][1]);
  });

  it('merges a previous workout into a non-empty day', () => {
    const realmExistingWorkout = cloneDeep(existingWorkout);
    // $FlowFixMe
    getWorkoutByPrimaryKey.mockImplementationOnce(() => realmExistingWorkout);
    copyWorkout(workout, '20191228');

    // $FlowFixMe
    expect(existingWorkout).toMatchDiffSnapshot(realmExistingWorkout);
    expect(realmExistingWorkout.exercises[0].sets).toMatchSnapshot();
  });
});
