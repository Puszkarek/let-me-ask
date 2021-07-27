import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AuthContextType } from "../types/AuthType";

export function useAuth(): AuthContextType {
  const value = useContext(AuthContext);
  return value;
}
