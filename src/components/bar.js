import React, { Fragment,useState,useEffect } from 'react';
import Login from './log';
import Wallet from './wallet';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";


export default function Serbar(){
  
  
    const [showLogin, setShowLogin] = useState(false);
    
      
  
    return(
        <Fragment>
        <div className='head'>
          <h1>CampusBite</h1>
          <button onClick={() => setShowLogin(true)}>Log in</button>
          <Wallet/>
        </div>
        {showLogin && (
          <div className="modal-overlay">
          <div className="modal-content">
        <Login />
             <button className="close-btn" onClick={() => setShowLogin(false)}> Close</button>
          </div>
          </div>
       
      )}
    

        </Fragment>
    );
}