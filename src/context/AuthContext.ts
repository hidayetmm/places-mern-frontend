import React from "react";

export type User = {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  image: string;
  isLoggedIn: Boolean;
};

export type Place = {
  id: string;
  title: string;
  description: string;
  image: string;
  address: string;
  location: { lat: string; lng: string };
  creator: { id: string; email: string; image: string; name: string };
};

export interface AuthContextInterface {
  userData: User;
  setUserData: (values: User) => void;
  places: Place[];
  setPlaces: (values: Place[]) => void;
  fetchPlacesToggle: boolean;
  setFetchPlacesToggle: () => void;
  userPlaces: Place[];
  setUserPlaces: (values: Place[]) => void;
}

export const defaultState = {
  userData: {
    id: "",
    username: "",
    email: "",
    accessToken: "",
    image: "",
    isLoggedIn: false,
  },
  setUserData: () => {},
  places: [],
  setPlaces: () => {},
  fetchPlacesToggle: false,
  setFetchPlacesToggle: () => {},
  userPlaces: [],
  setUserPlaces: () => {},
};

export const AuthContext =
  React.createContext<AuthContextInterface>(defaultState);

export const AuthProvider = AuthContext.Provider;
