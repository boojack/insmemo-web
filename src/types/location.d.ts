interface Query {
  tag: string;
  from: number;
  to: number;
  type: MemoType | "";
  text: string;
}

type AppRouter = "/" | "/signin" | "/trash";

interface AppLocation {
  pathname: AppRouter;
  hash: string;
  query: Query;
}

// just like React-Router
interface Router {
  [key: string]: JSX.Element | null;
  "*": JSX.Element | null;
}
