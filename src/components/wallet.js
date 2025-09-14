import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser) {
      fetchWallet(auth.currentUser.uid);
    }
  }, []);

  // Fetch wallet balance
  const fetchWallet = async (uid) => {
    setLoading(true);
    const walletRef = doc(db, "wallets", uid);
    const walletSnap = await getDoc(walletRef);
    if (walletSnap.exists()) {
      setBalance(walletSnap.data().balance);
    } else {
      // Create wallet if it doesn't exist
      await setDoc(walletRef, { balance: 0 });
      setBalance(0);
    }
    setLoading(false);
  };

  // Recharge wallet (for now fixed ₹100)
  const rechargeWallet = async () => {
    if (!auth.currentUser) return alert("Login required!");
    const walletRef = doc(db, "wallets", auth.currentUser.uid);

    const newBalance = balance + 100;
    await updateDoc(walletRef, { balance: newBalance });
    setBalance(newBalance);
  };

  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">E-Wallet</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="text-2xl font-bold text-green-700">₹{balance}</p>
          <button
            onClick={rechargeWallet}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Recharge +₹100
          </button>
        </>
      )}
    </div>
  );
}
