/* @flow */

// $FlowFixMe
const navigate = jest.fn();
// $FlowFixMe
const setParams = jest.fn();

export const useNavigation = () => ({
  navigate,
  setParams,
});

// $FlowFixMe
export const useFocusEffect = jest.fn();
