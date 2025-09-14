import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        saveUserToFirestore(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        lastLogin: new Date(),
      },
      { merge: true }
    );
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-in error:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {user ? (
        <div className="text-center">
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
          <button
            onClick={logout}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Continue with Google
        </button>
      )}
    </div>
  );
}
