import { createContext } from "react";
import appStore from ".";

const appContext = createContext(appStore.getState());

export default appContext;
