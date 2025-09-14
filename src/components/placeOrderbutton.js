import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function PlaceOrderButton() {
 const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for login/logout
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePlaceOrder = () => {
    if (!user) {
      alert("Please log in and then place your order");
      return;
    }

    console.log("Proceeding to payment for:", user.email);
    window.location.href = "/payment";
  };


  return (
    <button onClick={handlePlaceOrder}>
      Place Order
    </button>
  );
}
