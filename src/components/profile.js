import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Wallet from ". /Wallet";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        fetchOrders(u.uid);
      } else {
        setUser(null);
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch today’s orders
  const fetchOrders = async (uid) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of day

    const q = query(
      collection(db, "orders"),
      where("userId", "==", uid),
      where("createdAt", ">=", today)
    );

    const querySnapshot = await getDocs(q);
    const ordersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(ordersData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* User Info */}
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">{user.displayName}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">Please log in to see your profile.</p>
      )}

      {/* E-Wallet */}
      <Wallet />

      {/* Today’s Orders */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-bold mb-2">Today’s Orders</h2>
        {orders.length > 0 ? (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border rounded p-2 flex justify-between items-center"
              >
                <span>{order.itemName}</span>
                <span className="text-green-700 font-semibold">₹{order.amount}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No orders placed today.</p>
        )}
      </div>
    </div>
  );
}
