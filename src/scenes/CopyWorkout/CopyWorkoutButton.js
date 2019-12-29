/* @flow */

import React, { useRef } from 'react';
import HeaderButton from '../../components/Header/HeaderButton';
import i18n from '../../utils/i18n';
import { useSelector } from 'react-redux';
import { copyWorkout } from '../../utils/copyWorkout';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';

const CopyWorkoutButton = () => {
  const isCopying = useRef(false);
  const { goBack } = useNavigation();
  const day = useNavigationParam('day');
  const selectedWorkout = useSelector(
    state => state.copyWorkout.selectedWorkout
  );

  return (
    <HeaderButton
      disabled={selectedWorkout === null}
      onPress={() => {
        if (isCopying.current) {
          return;
        }
        isCopying.current = true;
        copyWorkout(selectedWorkout, day);
        setTimeout(() => goBack(), 50);
      }}
    >
      {i18n.t('copy_workout_button')}
    </HeaderButton>
  );
};

export default CopyWorkoutButton;
