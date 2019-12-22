/* @flow */

import * as React from 'react';
import { fireEvent, render } from 'react-native-testing-library';
import mockMoment from 'moment';

import DayItem from '../DayItem';
import theme from '../../../utils/theme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { isSameDay } from '../../../utils/date';
import { setSelectedDay } from '../../../redux/modules/home';
import { mockWorkouts } from '../../../database/services/__tests__/helpers/databaseMocks';

jest.mock('../../../hooks/useRealmResultsHook', () => () => ({
  data: [mockWorkouts[0]],
}));

jest.mock('../../../utils/date', () => {
  const date = jest.requireActual('../../../utils/date');
  return {
    ...date,
    getShortDayInfo: jest.fn(() => ({
      date: mockMoment('2019-05-02T00:00:00.000Z').get('date'),
      day: '2019-05-02T00:00:00.000Z',
    })),
    isAfter: jest.fn(() => false),
    getToday: jest.fn(() => '2019-05-02T00:00:00.000Z'),
    dateToWorkoutId: jest.fn(() => '20190502'),
    isSameDay: jest.fn(),
  };
});

const mockDispatch = jest.fn();

jest.mock('react-redux', () => {
  const reactRedux = jest.requireActual('react-redux');
  return {
    ...reactRedux,
    useDispatch: () => mockDispatch,
  };
});

describe('DayItem', () => {
  const _getRender = () => {
    return render(
      <Provider
        store={createStore(() => ({
          home: { selectedDay: '20190502' },
        }))}
      >
        <DayItem dateString="2019-05-02T00:00:00.000Z" theme={theme} />
      </Provider>
    );
  };

  it('renders a past day', () => {
    // $FlowFixMe
    isSameDay.mockImplementationOnce(() => false);
    const { getByTestId } = _getRender();
    const elem = getByTestId('day-text-container');
    expect(elem.props.style).toEqual([
      { alignItems: 'center', opacity: 0.5 },
      false,
    ]);
  });

  it('renders a selected day', () => {
    // $FlowFixMe
    isSameDay.mockImplementationOnce(() => true);
    const { getByTestId } = _getRender();
    const elem = getByTestId('day-text-container');
    expect(elem.props.style).toContainEqual({ opacity: 1 });
  });

  it('dispatch changing selected day on pressing', () => {
    const { getByTestId } = _getRender();
    const touchable = getByTestId('day-touchable');
    fireEvent(touchable, 'onPress');

    expect(mockDispatch).toHaveBeenCalledWith(
      setSelectedDay('2019-05-02T00:00:00.000Z')
    );
  });

  it.skip('renders without a dot if there is no workout', () => {
    // TODO fix this one
    // jest.setMock('../../../hooks/useRealmResultsHook', () => () => ({
    //   data: [],
    // }));
    const { queryByTestId } = _getRender();
    expect(queryByTestId('day-dot')).toBeNull();
  });

  it('renders a dot if there is a workout', () => {
    const { queryByTestId } = _getRender();
    expect(queryByTestId('day-dot')).not.toBeNull();
  });
});
