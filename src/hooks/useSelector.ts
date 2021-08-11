import { useEffect, useState } from "react";

type Listener<S> = (ns: S, ps?: S) => void;

interface Action {
  type: string;
}
interface Store<S, A extends Action> {
  dispatch: (a: A) => void;
  getState: () => S;
  subscribe: (listener: Listener<S>) => () => void;
}

export default function useSelector<S, A extends Action>(store: Store<S, A>): S {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((ns) => {
      setState(ns);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}
