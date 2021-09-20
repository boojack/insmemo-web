import { createContext } from "react";
import appStore from "../stores";

const AppContext = createContext(appStore.getState());

export default AppContext;
