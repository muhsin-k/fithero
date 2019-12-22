/* @flow */

import * as React from 'react';
import { render } from 'react-native-testing-library';

import { getToday, toDate } from '../../../utils/date';
import HomeScreen from '../HomeScreen';
import { Provider } from 'react-redux';
import { RealmArray } from '../../../database/services/__tests__/helpers/databaseMocks';
import { createStore } from 'redux';

jest.mock('react-navigation', () => ({
  NavigationEvents: () => null,
  withNavigation: c => c,
}));

const dateString = '2018-05-22T00:00:00.000Z';
const dateStringLater = '2018-05-23T00:00:00.000Z';

const mockWorkouts = [
  {
    id: '20180522',
    date: toDate(dateString),
    comments: 'Testing comment.',
    exercises: new RealmArray(),
    isValid: jest.fn(() => true),
  },
  {
    id: '20180523',
    date: toDate(dateStringLater),
    exercises: new RealmArray(),
    isValid: jest.fn(() => true),
  },
];

jest.mock('../../../hooks/useRealmResultsHook', () => () => ({
  data: mockWorkouts,
}));

jest.mock('../../../utils/date', () => {
  const actualDate = jest.requireActual('../../../utils/date');
  return {
    ...actualDate,
    getToday: jest.fn(),
  };
});

describe('HomeScreen', () => {
  const _getRender = selectedDay => {
    return render(
      <Provider
        store={createStore(() => ({
          settings: {
            firstDayOfTheWeek: 'monday',
          },
          home: {
            selectedDay,
          },
        }))}
      >
        <HomeScreen />
      </Provider>
    );
  };

  it('render comments if the workout has them', () => {
    // $FlowFixMe
    getToday.mockImplementation(() => '2018-05-22T00:00:00.000Z');
    const { getByText } = _getRender('20180522');

    expect(getByText(mockWorkouts[0].comments)).toBeDefined();
  });

  it('does not render comments if the workout does not have them', () => {
    // $FlowFixMe
    getToday.mockImplementation(() => '2018-05-23T00:00:00.000Z');
    const { queryByText } = _getRender('20180523');

    expect(queryByText(mockWorkouts[0].comments)).toBeNull();
  });
});
