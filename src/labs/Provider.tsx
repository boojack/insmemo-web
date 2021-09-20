import React, { useEffect, useState } from "react";
import { Store } from "./createStore";
import AppContext from "./AppContext";

interface Props {
  children: React.ReactElement;
  store: Store<any, any>;
}

/**
 * Toy-Redux Provider
 * Just for debug with the app store
 */
const Provider: React.FC<Props> = (props: Props) => {
  const { children, store } = props;
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((ns) => {
      setState(ns);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export default Provider;
