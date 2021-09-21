import { createContext } from "react";
import appStore from "../stores";

const appContext = createContext(appStore.getState());

export default appContext;
