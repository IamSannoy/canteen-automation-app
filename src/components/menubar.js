import React, { Fragment,useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import PlaceOrderButton from './placeOrderbutton';
export default function Menubar(){
    const [menu, setMenu] = useState([]);

  // Fetch menu live (read-only)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "menu"), (snapshot) => {
      setMenu(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

    return(
        <Fragment>
            <div className="p-6">
      <h2 className="text-xl font-bold">📋 Menu</h2>
      <ul>
        {menu.map((item) => (
          <li key={item.id} className="flex justify-between items-center my-2">
            <span>{item.name} - ₹{item.price}</span>
            <PlaceOrderButton item={item} />
          </li>
        ))}
      </ul>
    </div>
        </Fragment>
    )
}