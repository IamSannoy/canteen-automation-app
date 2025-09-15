import React, { useEffect, useState } from "react";
import { auth,db } from "../firebase";
import { collection, getDoc, deleteDoc,updateDoc, doc, addDoc,serverTimestamp } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function PlaceOrderButton({ item }) {
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [wallet, setWallet] = useState(0);
const user = auth.currentUser;

  useEffect(() => {
    const fetchWallet = async () => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setWallet(snap.data().wallet || 0);
        }
      }
    };
    fetchWallet();
  }, [user]);

  const handleOpenPopup = () => {
    setQuantity(1); // reset to default
    setConfirmed(false);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

   const handleConfirmPay = async () => {
    const total = item.price * quantity;

    if (total > wallet) {
      alert("⚠️ Not enough balance in wallet!");
      return;
    }

    try {
      // Deduct from wallet
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        wallet: wallet - total,
      });

      // Save order in Firestore
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        itemName: item.name,
        quantity,
        totalPrice: total,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ Order placed successfully!");
      setWallet(wallet - total); // update UI
      setShowPopup(false);
    } catch (err) {
      console.error("Order error:", err);
      alert(" Failed to place order.");
    }
  };

  return (
    <>
      {/* Place Order Button */}
      <button
        onClick={handleOpenPopup}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
       Order
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>

            {/* Quantity */}
            <label className="block mb-2 font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 w-20 text-center rounded mb-4"
            />

            {/* Order Summary */}
            <p className="mb-2">🍽️ Item: <strong>{item.name}</strong></p>
            <p className="mb-2">💰 Price per plate: ₹{item.price}</p>
            <p className="mb-4 text-lg font-semibold">
              Total: ₹{item.price * quantity}
            </p>

            {/* Buttons */}
            {!confirmed ? (
              <button
                onClick={handleConfirmPay}
                className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
              >
                Confirm Pay
              </button>
            ) : (
              <p className="text-green-600 font-semibold">Payment Confirmed ✅</p>
            )}

            <button
              onClick={handleClosePopup}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
            Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
