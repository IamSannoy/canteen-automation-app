// AdminPage.js
import React, { useEffect, useState } from "react";
import { auth,db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc,updateDoc, doc, addDoc,onSnapshot } from "firebase/firestore";

export default function AdminPage() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    
    return () => {
      signOut(auth).then(() => {
        console.log("Admin logged out automatically");
      });
    };
  }, []);
  // Fetch menu
  const fetchMenu = async () => {
  const snap = await getDocs(collection(db, "menu"));
  setMenu(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
};

useEffect(() => {
  fetchMenu();
}, []);


  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "menu"), (snapshot) => {
    setMenu(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });

  return () => unsubscribe(); // cleanup on unmount
}, []);

  // Mark order ready
  const markReady = async (id) => {
    const ref = doc(db, "orders", id);
    await updateDoc(ref, { status: "Ready" });
    alert("Order marked ready!");
  };

  // Add menu item
  const addMenuItem = async () => {
  const name = prompt("Enter item name:");
  const price = prompt("Enter item price:");

  if (name && price) {
    await addDoc(collection(db, "menu"), {
      name,
      price: Number(price),
    });
    alert("Item added!");

    // fetch menu again after adding
    fetchMenu();
  }
};
const removeMenuItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this item?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "menu", id));
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status: newStatus });

    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };
  return (
    <>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Menu Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Menu</h2>
        <ul>
          {menu.map((item) => (
            <li key={item.id}>{item.name} - ₹{item.price}
            <button 
              onClick={() => removeMenuItem(item.id)} 
              className="bg-red-600 text-white px-3 py-1 rounded-lg"
            >
               Remove
            </button></li>
          ))}
        </ul>
        <button onClick={addMenuItem} className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Add Item
        </button>
      </div>

      {/* Orders Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Orders</h2>
         {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Item</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="border p-2">{order.userEmail}</td>
                <td className="border p-2">{order.itemName}</td>
                <td className="border p-2">{order.quantity}</td>
                <td className="border p-2">₹{order.totalPrice}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  {order.status === "In the Way" && (
                    <button
                      onClick={() => updateStatus(order.id, "Ready")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === "Ready" && <span>Ready</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
      </div>
    </>
  );
}
