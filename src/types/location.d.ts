interface Duration {
  from: number;
  to: number;
}

interface Query {
  tag: string;
  duration: Duration | null;
  type: MemoSpecType | "";
  text: string;
  filter: string;
}

type AppRouter = "/" | "/signin" | "/trash" | "/setting";

interface AppLocation {
  pathname: AppRouter;
  hash: string;
  query: Query;
}
