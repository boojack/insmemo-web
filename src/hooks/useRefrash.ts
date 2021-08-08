import { useCallback, useState } from "react";

export default function useRefrash(): () => void {
  const [state, setState] = useState(false);

  const refrash = useCallback(() => {
    setState((state) => !state);
  }, []);

  return refrash;
}
