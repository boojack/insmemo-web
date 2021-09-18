import React, { useEffect, useState } from "react";
import { Store } from "./createStore";

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
  const [_, setState] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setState((s) => !s);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default Provider;
