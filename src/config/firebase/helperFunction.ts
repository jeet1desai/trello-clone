import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  UserCredential,
  AuthProvider,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { handleLoginResp, handleLogoutResp } from "../../components/social";
import { Dispatch } from "redux";

export const getAccessToken = (
  provider: AuthProvider,
  result: UserCredential
): string | null => {
  if (provider instanceof GoogleAuthProvider) {
    return GoogleAuthProvider.credentialFromResult(result)?.accessToken ?? null;
  } else if (provider instanceof FacebookAuthProvider) {
    return (
      FacebookAuthProvider.credentialFromResult(result)?.accessToken ?? null
    );
  } else if (provider instanceof OAuthProvider) {
    return OAuthProvider.credentialFromResult(result)?.accessToken ?? null;
  }
  return null;
};

export const handleAuthError = (error: unknown, providerName: string) => {
  // Check if the error is a FirebaseError
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/cancelled-popup-request":
        console.warn(
          `Popup was cancelled before completing Social login. Provider Name ==> ${providerName}`
        );
        break;
      case "auth/popup-closed-by-user":
        console.warn(
          `Popup was closed before completing Social login. Provider Name ==> ${providerName}`
        );
        break;
      case "auth/invalid-credential":
        console.error(
          `Invalid credential provided. Please check your configuration. Provider Name ==> ${providerName}`
        );
        break;
      default:
        console.error(
          `Firebase Error during login Provider Name ==> ${providerName}: ${error.message}`
        );
    }
  } else {
    // Handle unknown errors
    console.error(`An unexpected error occurred`, error);
  }
};

export const handleSignIn = async (
  provider: GoogleAuthProvider | FacebookAuthProvider | OAuthProvider,
  providerName: string,
  dispatch: Dispatch,
  goTo: (path: string) => void
) => {
  try {
    const result = await signInWithPopup(auth, provider);
    // const token = await result.user.getIdToken();

    const token = getAccessToken(provider, result);
    const user = result.user;
    handleLoginResp(user, token, providerName, dispatch, goTo);
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      // Pass the error for centralized handling
      handleAuthError(error, providerName);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

export const handleLogout = async (
  dispatch: Dispatch,
  goTo: (path: string) => void
) => {
  try {
    await signOut(auth);
    handleLogoutResp(dispatch, goTo);
  } catch (e) {
    console.error("Error during logout:", e);
  }
};
