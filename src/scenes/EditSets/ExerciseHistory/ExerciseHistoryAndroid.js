/* @flow */

import React, { useLayoutEffect, useState } from 'react';

import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import type { NavigationType } from '../../../types';
import ExerciseHistory from './ExerciseHistory';

type Props = {
  type: 'string',
  unit: DefaultUnitSystemType,
  navigation: NavigationType<{
    exerciseKey: string,
  }>,
};

const ExerciseHistoryAndroid = (props: Props) => {
  const [showHistory, setShowHistory] = useState(true); // TODO

  // TODO not working
  useLayoutEffect(() => {
    const didFocusSubscription = props.navigation.addListener(
      'didFocus',
      () => {
        // We just need this once, not when we re-focus
        didFocusSubscription.remove();
        setShowHistory(true);
      }
    );
    return () => didFocusSubscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!showHistory) return null;

  return <ExerciseHistory {...props} />;
};

export default ExerciseHistoryAndroid;
