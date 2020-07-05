import React, { createContext, useReducer } from "react";
import { ContextDevTool } from "react-context-devtool";
import { initialState, reducer } from "./Reducer";

export const RootContext = createContext();

export const ContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <RootContext.Provider value={{ state: state, dispatch: dispatch }}>
      <ContextDevTool
        context={RootContext}
        id="r423r32red2dqe"
        displayName="RootContext"
      />

      {props.children}
    </RootContext.Provider>
  );
};
