interface Duration {
  from: number;
  to: number;
}

interface Query {
  tag: string;
  duration: Duration | null;
  type: MemoType | "";
  text: string;
}

type AppRouter = "/" | "/signin" | "/trash";

interface AppLocation {
  pathname: AppRouter;
  hash: string;
  query: Query;
}
