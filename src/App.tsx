import Header from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import {
  AuthProvider,
  AuthContextInterface,
  User,
  Place,
} from "./context/AuthContext";
import { useState, useEffect } from "react";
import PlacesHome from "./containers/PlacesHome/PlacesHome";
import "./App.css";
import Axios from "axios";
import { AppShell, useMantineTheme } from "@mantine/core";
import Footer from "./components/Footer/Footer";
import UserProfile from "./containers/UserProfile/UserProfile";

function App() {
  Axios.defaults.baseURL = "http://localhost:7070/api/";

  const storedUserData = localStorage.getItem("userData");

  const defaultState = {
    userData: storedUserData
      ? JSON.parse(storedUserData)
      : {
          id: "",
          username: "",
          email: "",
          accessToken: "",
          image: "",
          isLoggedIn: false,
        },
    setUserData: (values: User): void =>
      setContextData((prevState: AuthContextInterface) => ({
        ...prevState,
        userData: values,
      })),
    places: [],
    setPlaces: (values: Place[]): void =>
      setContextData((prevState: AuthContextInterface) => ({
        ...prevState,
        places: values,
      })),
    fetchPlacesToggle: false,
    setFetchPlacesToggle: () =>
      setContextData((prevState: AuthContextInterface) => ({
        ...prevState,
        fetchPlacesToggle: !prevState.fetchPlacesToggle,
      })),
    userPlaces: [],
    setUserPlaces: (values: Place[]): void =>
      setContextData((prevState: AuthContextInterface) => ({
        ...prevState,
        userPlaces: values,
      })),
  };

  const [contextData, setContextData] =
    useState<AuthContextInterface>(defaultState);

  const { colorScheme, colors } = useMantineTheme();
  useEffect(() => {
    if (colorScheme === "dark") {
      document.body.style.backgroundColor = colors.dark[8];
    } else if (colorScheme === "light") {
      document.body.style.backgroundColor = colors.gray[0];
    }
  }, [colorScheme, colors]);

  return (
    <AuthProvider value={contextData}>
      <AppShell
        padding={0}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<PlacesHome />} />
            <Route path="/:username" element={<UserProfile />} />
          </Routes>
        </div>
        <Footer />
      </AppShell>
    </AuthProvider>
  );
}

export default App;
