import { useEffect, useState } from "react";
import { Action, Store } from "../labs/createStore";

export default function useSelector<S, A extends Action>(store: Store<S, A>): S {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    store.subscribe((ns) => {
      setState(ns);
    });
  }, []);

  return state;
}
