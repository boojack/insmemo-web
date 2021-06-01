interface Action {
  type: string;
}

type Reducer<S, A extends Action> = (s: S, a: A) => S;

type Unsubscribe = () => void;

interface Store<S, A extends Action> {
  dispatch: (a: A) => void;
  getState: () => S;
  subscribe: (listener: (s: S) => void) => Unsubscribe;
  __emit__: () => void;
}

function createStore<S, A extends Action>(preloadedState: S, reducer: Reducer<S, A>): Store<S, A> {
  type Listener = (s: S) => void;

  const listeners: Listener[] = [];
  let currentState = preloadedState;

  const dispatch = (action: A) => {
    const nextState = reducer(currentState, action);
    currentState = nextState;

    for (const cb of listeners) {
      cb(currentState);
    }
  };

  const subscribe = (listener: Listener) => {
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
      cb(currentState);
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
