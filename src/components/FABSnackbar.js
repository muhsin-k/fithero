/* @flow */

import React, { Fragment, useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';

type Props = {
  show: boolean,
  onFabPress: () => mixed,
  onDismiss: () => mixed,
  fabIcon: string,
  snackbarText: string,
};

const FABSnackbar = ({
  show,
  onFabPress,
  onDismiss,
  fabIcon,
  snackbarText,
}: Props) => {
  const [fabAnimatedValue] = useState(new Animated.Value(0));
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    if (!snackbarVisible && show) {
      Animated.timing(fabAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setSnackbarVisible(true);
    } else if (snackbarVisible && !show) {
      Animated.timing(fabAnimatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setSnackbarVisible(false);
    }
  }, [fabAnimatedValue, show, snackbarVisible]);

  return (
    <Fragment>
      <NavigationEvents
        onWillBlur={() => {
          if (snackbarVisible) {
            onDismiss();
          }
        }}
      />
      <FAB
        icon={fabIcon}
        onPress={onFabPress}
        style={[
          styles.fab,
          {
            transform: [
              {
                translateY: fabAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -48],
                }),
              },
            ],
          },
        ]}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismiss}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarText}
      </Snackbar>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default FABSnackbar;
