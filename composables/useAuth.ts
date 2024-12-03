import { getAuth } from "firebase/auth";

export const useAuth = () => {
  const auth = getAuth();
  return auth;
};
