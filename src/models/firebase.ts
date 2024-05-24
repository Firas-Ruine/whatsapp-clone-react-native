import { User as FirebaseUser } from "firebase/auth";

export interface FirebaseAuthError {
  code: string;
  message: string;
}

export interface ExtendedUser extends FirebaseUser {
    stsTokenManager: {
      accessToken: string;
    };
  }