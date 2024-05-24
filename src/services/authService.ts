import { auth, database } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutUser,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { FirebaseAuthError, ExtendedUser } from "@/models/firebase";
import { router } from "expo-router";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { ref as dbRef, set, getDatabase, get } from "firebase/database";

interface UploadResult {
  downloadUrl: string;
  metadata: any;
}

/**
 * This service is used to handle all authentication related operations
 *
 * @returns {object} The result of this function
 */
const AuthService = () => {
  /**
   * This function is used to sign in a user
   *
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   *
   * @returns {void} The result of this function
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      const user = userCredential.user as ExtendedUser;
      // Check if the user's email or token is null
      if (user.email === null || user.stsTokenManager.accessToken === null) {
        throw new Error("User email or token is null");
      }
      // Save the user's email and token in the secure store
      await SecureStore.setItemAsync("email", user.email);
      await SecureStore.setItemAsync("token", user.stsTokenManager.accessToken);
      // set the user as signed in
      await SecureStore.setItemAsync("isSignedIn", "true");
    } catch (error) {
      const firebaseError = error as FirebaseAuthError; // Type assertion
      const errorCode = firebaseError.code;
      const errorMessage = firebaseError.message;
      console.log(errorCode, errorMessage);
    }
  };

  /**
   * This function is used to register a new user
   *
   * @param {string} name - The name of the user
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * @param {string} profilePicture - The profile picture of the user
   *
   * @returns {void} The result of this function
   */
  const register = async (
    name: string,
    email: string,
    password: string,
    profilePicture: string
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user as ExtendedUser;
      if (user.email === null || user.stsTokenManager.accessToken === null) {
        throw new Error("User email or token is null");
      }
      const uploadResult = await uploadToFirebase(
        profilePicture,
        profilePicture.split("/").pop()!,
        (v: number) => console.log(v)
      );
      await SecureStore.setItemAsync("email", user.email);
      await SecureStore.setItemAsync("token", user.stsTokenManager.accessToken);
      // Store user profile in the Realtime Database
      const userProfileRef = dbRef(database, `users/${user.uid}`);
      await set(userProfileRef, {
        name: name,
        email: user.email,
        profilePicture: uploadResult.downloadUrl,
      });

      router.navigate("/(auth)/login");
    } catch (error) {
      const firebaseError = error as FirebaseAuthError;
      const errorCode = firebaseError.code;
      const errorMessage = firebaseError.message;
      console.log(errorCode, errorMessage);
    }
  };

  /**
   * This function is used to upload an image to Firebase Storage
   *
   * @param uri - The URI of the image
   * @param name - The name of the image
   * @param onProgress - The progress of the upload
   * @returns
   */
  const uploadToFirebase = async (
    uri: string,
    name: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> => {
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();

    const imageRef = ref(getStorage(), `profilePictures/${name}`);

    const uploadTask = uploadBytesResumable(imageRef, theBlob);

    return new Promise<UploadResult>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadUrl,
            metadata: uploadTask.snapshot.metadata,
          });
        }
      );
    });
  };

  /**
   * Retrieves the profile picture URL from Firebase Realtime Database.
   *
   * @param {string} userId - The ID of the user whose profile picture URL is to be retrieved.
   * @returns {Promise<string | null>} - The URL of the profile picture or null if not found.
   */
  const getProfilePictureUrl = async (
    userId: string
  ): Promise<string | null> => {
    const db = getDatabase();
    const userRef = dbRef(db, `users/${userId}/profilePicture`);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No profile picture URL found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile picture URL:", error);
      return null;
    }
  };

  /**
   * This function is used to sign out a user
   *
   * @returns {void} The result of this function
   */
  const signOut = async (): Promise<void> => {
    try {
      await auth.signOut();
      await SecureStore.deleteItemAsync("email");
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("isSignedIn");
      await signOutUser(auth);
      router.navigate("/(auth)/login");
    } catch (error) {
      const firebaseError = error as FirebaseAuthError;
      const errorCode = firebaseError.code;
      const errorMessage = firebaseError.message;
      console.log(errorCode, errorMessage);
    }
  };

  return {
    signIn,
    register,
    signOut,
    getProfilePictureUrl,
  };
};
export default AuthService;
