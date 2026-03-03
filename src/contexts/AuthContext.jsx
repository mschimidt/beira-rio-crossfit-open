import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock a fake user if Firebase is not configured
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  useEffect(() => {
    // A simple check to see if the config is still the placeholder
    if (auth.app.options.apiKey !== 'YOUR_API_KEY') {
      setIsFirebaseConfigured(true);
    } else {
      console.warn('Firebase is not configured. Using mock authentication.');
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    if (!isFirebaseConfigured) {
      console.log("Mock login successful");
      setCurrentUser({ email: "admin@test.com" }); // Mock user object
      return Promise.resolve();
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!isFirebaseConfigured) {
      console.log("Mock logout successful");
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
