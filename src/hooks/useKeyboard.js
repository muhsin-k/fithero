/* @flow */

import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import useSafeArea from './useSafeArea';

const bottomTabsHeight = 54;

const useKeyboard = (cb: (height: number) => void) => {
  const { bottom } = useSafeArea();
  useEffect(() => {
    const keyboardOpenListener = Keyboard.addListener('keyboardDidShow', e => {
      cb(
        Platform.OS === 'ios'
          ? e.endCoordinates.height - bottom - bottomTabsHeight - 8
          : e.endCoordinates.height - bottomTabsHeight
      );
    });

    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        cb(0);
      }
    );

    return () => {
      keyboardOpenListener.remove();
      keyboardHideListener.remove();
    };
  }, [bottom, cb]);
};

export default useKeyboard;
