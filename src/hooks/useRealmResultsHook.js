/* @flow */

import { useCallback, useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { useFocusEffect } from 'react-navigation-hooks';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../database/constants';

type ResultType<T> = {
  data: Array<T>,
  timestamp: number,
};

export type QueryType<T> = () => ?{
  addListener: ((Array<T>) => void) => void,
  removeAllListeners: () => void,
};

type ArgsType<T> = {|
  query: QueryType<T>,
  debounceTime?: number,
  prevFn?: ?(data: *) => *,
  hasChanged?: (prevData: *, newData: Array<T>) => boolean,
|};

export default function useRealmResultsHook<T>({
  query,
  debounceTime,
  prevFn,
  hasChanged,
}: ArgsType<T>): ResultType<T> {
  const _isFocused = useRef(false);
  const prevData = useRef(null);

  const [data, setData] = useState(() => {
    const dataQuery = query();
    const data = !dataQuery || !dataQuery.addListener ? [] : dataQuery;
    prevData.current = prevFn ? prevFn(data) : null;
    return {
      data,
      timestamp: Date.now(),
    };
  });

  useFocusEffect(
    useCallback(() => {
      _isFocused.current = true;
      return () => {
        _isFocused.current = false;
      };
    }, [])
  );

  useEffect(() => {
    const dataQuery = query();
    if (!dataQuery || !dataQuery.addListener) {
      return;
    }

    function handleChange(newData: Array<T>) {
      // Optional function to avoid unnecessary re-renders
      if (hasChanged && !hasChanged(prevData.current, newData)) {
        return;
      }

      prevData.current = prevFn ? prevFn(newData) : null;
      setData({
        data: newData,
        // Realm mutates the array instead of returning a new copy,
        // thus for a FlatList to update, we can use a timestamp as
        // extraData prop
        timestamp: Date.now(),
      });
    }

    const updateData =
      // $FlowIgnore
      debounceTime || !_isFocused.current
        ? debounce(
            handleChange,
            // $FlowIgnore
            debounceTime ? debounceTime : REALM_DEFAULT_DEBOUNCE_VALUE
          )
        : handleChange;

    dataQuery.addListener(updateData);
    return () => {
      if (updateData.cancel) {
        updateData.cancel();
      }
      dataQuery.removeAllListeners();
    };
  }, [debounceTime, hasChanged, prevFn, query]);

  // $FlowFixMe type Realm results here properly
  return data;
}
