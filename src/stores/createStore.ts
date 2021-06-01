export interface Action {
  type: string;
}

type Reducer<S, A extends Action> = (s: S, a: A) => S;
type Listener<S> = (s: S, ns: S) => void;
type Unsubscribe = () => void;

interface Store<S, A extends Action> {
  dispatch: (a: A) => void;
  getState: () => S;
  subscribe: (listener: Listener<S>) => Unsubscribe;
  __emit__: () => void;
}

/**
 * 简单实现的 Redux
 * @param preloadedState 初始 state
 * @param reducer reducer pure function
 * @returns store
 */
function createStore<S, A extends Action>(preloadedState: S, reducer: Reducer<S, A>): Store<S, A> {
  const listeners: Listener<S>[] = [];
  let currentState = preloadedState;

  const dispatch = (action: A) => {
    const nextState = reducer(currentState, action);
    const prevState = currentState;
    currentState = nextState;

    for (const cb of listeners) {
      cb(currentState, prevState);
    }
  };

  const subscribe = (listener: Listener<S>) => {
    let isSubscribed = true;
    listeners.push(listener);

    return () => {
      if (!isSubscribed) {
        return;
      }

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
      isSubscribed = false;
    };
  };

  const getState = () => {
    return currentState;
  };

  /**
   * DO NOT USE FREQUENTLY
   * 主动触发监听回调
   */
  const __emit__ = () => {
    for (const cb of listeners) {
      cb(currentState, currentState);
    }
  };

  return {
    dispatch,
    getState,
    subscribe,
    __emit__,
  };
}

export default createStore;
