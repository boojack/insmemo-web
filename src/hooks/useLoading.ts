import { useState } from "react";

function useLoading() {
  const [state, setState] = useState({ isLoading: true, isFailed: false, isSucceed: false });

  return {
    ...state,
    setLoading: () => {
      setState({
        ...state,
        isLoading: true,
        isFailed: false,
        isSucceed: false,
      });
    },
    setFinish: () => {
      setState({
        ...state,
        isLoading: false,
        isFailed: false,
        isSucceed: true,
      });
    },
    setError: () => {
      setState({
        ...state,
        isLoading: false,
        isFailed: true,
        isSucceed: false,
      });
    },
  };
}

export default useLoading;
