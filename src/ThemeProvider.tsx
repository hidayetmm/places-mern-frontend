import { FC, useState, useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { ThemeContext } from "./context/ThemeContext";

const ThemeProvider: FC = ({ children }) => {
  const d = new Date();
  const currentHour = d.getHours();

  const [dark, setDark] = useState<Boolean>(
    currentHour >= 18 || currentHour <= 6 ? true : false
  );

  const themeStoreHandler = (value: Boolean) => {
    setDark(value);
    localStorage.setItem("darkTheme", JSON.stringify(value));
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkTheme");
    if (storedTheme) {
      setDark(storedTheme === "true" ? true : false);
    }
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{ toggleDark: (value: Boolean) => themeStoreHandler(value) }}
    >
      <MantineProvider theme={{ colorScheme: dark ? "dark" : "light" }}>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
