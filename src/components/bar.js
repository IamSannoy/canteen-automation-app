import React, { Fragment,useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { auth, db, ADMIN_EMAIL} from "../firebase";
import { 
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
export default function Serbar() {
  
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const provider= new GoogleAuthProvider();
  const navigate = useNavigate();

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
        const result=await signInWithPopup(auth, provider);
        const user = result.user;
        console.log(user.email);
        if (user && user.email) {
  if (user.email === ADMIN_EMAIL) {
    navigate("/admin");
  } else {
    navigate("/");
  }}
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
  

    return(
        <Fragment>
        <nav className="navbar">
  <div className="nav-left">
    <img src="/logo.png" alt="CampusBite Logo" className="logo" />
    <h1 className="brand-name">CampusBite</h1>
  </div>
{user ? (
        <button className="profile-btn" onClick={() => navigate("/profile")}>
          profile
        </button>
      ) : (
  <div className="nav-right">
    <button className="login-btn" onClick={() => setShowLogin(true)}>
      Log in
    </button>
  </div>)}
  {showLogin && (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  {/* Card Container */}
  <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center">
    
    {/* Welcome Text */}
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h2>
    
    {/* Google Button */}
    <button
      onClick={loginWithGoogle}
      className="flex items-center justify-center gap-2 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google Logo"
        className="w-1 h-1 bg-white rounded-full"
      />
      Continue with Google
    </button>
  </div>
</div>   
    </div>
        <button
      onClick={() => setShowLogin(false)}
      className="cls-btn"
    >Close</button>
      </div>
    </div>
  )}
</nav>

        </Fragment>
    );
}