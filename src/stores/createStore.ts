function createStore<State, Action>(initialState: State, reducer: (s: State, a: Action) => State) {
  type Listener = (s: State) => void;

  let state: State = initialState;
  const listeners: Listener[] = [];

  const dispatch = (action: Action) => {
    const nextState = reducer(state, action);
    state = nextState;

    for (const cb of listeners) {
      cb(state);
    }
  };

  const subscribe = (listener: Listener) => {
    const index = listeners.push(listener) - 1;

    return () => {
      listeners.splice(index, 1);
    };
  };

  const getState = (): State => {
    return state;
  };

  /**
   * DO NOT USE FREQUENTLY
   * 主动触发监听回调
   */
  const __emit__ = () => {
    for (const cb of listeners) {
      cb(state);
    }
  };

  return {
    dispatch,
    subscribe,
    getState,
    __emit__,
  };
}

export default createStore;
