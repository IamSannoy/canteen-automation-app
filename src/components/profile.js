// src/components/Profile.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Wallet from "./wallet";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Ensure user doc exists in Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setWallet(snap.data().wallet || 0);
        } else {
          // Create user with wallet = 0 if first time login
          await setDoc(docRef, {
            name: currentUser.displayName,
            email: currentUser.email,
            wallet: 0,
            photo: currentUser.photoURL,
            lastLogin: new Date(),
          });
          setWallet(0);
        }
      } else {
        setUser(null);
        navigate("/"); // if logged out, go home
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading profile...</p>;
  }

  if (!user) {
    return <p style={{ padding: "2rem" }}>Not logged in</p>;
  }

  return (
  
  <div className="profile-container">
    {/* Profile Card */}
    <div className="profile-card">
      <img
        src={user.photoURL}
        alt="Profile"
        className="profile-img"
      />
      <h2 className="profile-name">{user.displayName}</h2>
      <p className="profile-email">{user.email}</p>

      {/* Divider */}
      <hr className="divider" />
      <Wallet />

      {/* Logout Button */}
      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </div>
  </div>
  );
}
