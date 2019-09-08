/* @flow */

import { Share } from 'react-native';

import { shareWorkout } from '../share';
import {
  mockCustomExercise,
  mockWorkouts,
} from '../../database/services/__tests__/helpers/databaseMocks';

jest.mock('Share', () => ({
  share: jest.fn(),
}));

jest.mock('moment/locale/es', () => {});

jest.mock('../../database/services/ExerciseService', () => {
  const exerciseService = jest.requireActual(
    '../../database/services/ExerciseService'
  );
  return {
    ...exerciseService,
    getExerciseById: () => [mockCustomExercise],
  };
});

describe('share', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const _expectMessage = msg => {
    expect(
      Share.share.mock.calls[0][0].message.replace(/\s+/g, ' ').trim()
    ).toEqual(msg);
  };

  it('generates proper message text', async () => {
    // $FlowFixMe need to type Realm workout better
    await shareWorkout(mockWorkouts[0]);
    const expectedMessage =
      'FitHero - Friday, May 4, 2018 Bench Press: Barbell 1. 220.46 lb x 18 reps';

    _expectMessage(expectedMessage);
  });

  it('generates proper message text with a custom exercise', async () => {
    const workout = mockWorkouts[0];
    workout.exercises[1] = mockCustomExercise;

    const expectedMessage =
      'FitHero - Friday, May 4, 2018 Bench Press: Barbell 1. 220.46 lb x 18 reps Custom exercise 1. 50 kgs x 12 reps';

    // $FlowFixMe need to type Realm workout better
    await shareWorkout(workout);

    _expectMessage(expectedMessage);
  });
});
