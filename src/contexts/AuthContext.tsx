import { createContext, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";
import {
  User,
  AuthContextType,
  AuthContextProviderProps,
} from "../types/AuthType";

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(
  props: AuthContextProviderProps
): JSX.Element {
  const [user, setUser] = useState<User>();
  function configUser(user: any) {
    const { displayName, photoURL, uid } = user;
    if (!displayName || !photoURL) {
      throw new Error("missing Account information");
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL,
    });
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        configUser(user);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const response = await auth.signInWithPopup(provider);
    if (response.user) {
      configUser(response.user);
    }
  }
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
