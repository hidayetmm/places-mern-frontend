import React from "react";

interface ThemeContextInterface {
  toggleDark: (value: Boolean) => void;
}

const defaultState = {
  toggleDark: () => {},
};

export const ThemeContext =
  React.createContext<ThemeContextInterface>(defaultState);
