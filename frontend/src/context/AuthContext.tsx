// IMPORTING CORE REACT UTILITIES
import React, { createContext, useContext, useState, useEffect } from 'react'; // REQUIREMENT: Context and State hooks. IMPORTANCE: Enables sharing data (like user info) across the entire app without passing props manually.

// DATA STRUCTURE DEFINITIONS
// REQUIREMENT: Type safety. IMPORTANCE: Ensures the app knows exactly what fields a "User" object has, preventing bugs.
interface User {
  id: string;
  name: string;
  email: string;
}

// REQUIREMENT: Context Shape. IMPORTANCE: Defines what data and functions are available to any component that uses this context.
interface AuthContextType {
  user: User | null; // The logged-in user object or null if logged out.
  token: string | null; // The security token used for API requests.
  login: (user: User, token: string) => void; // Function to log the user in.
  logout: () => void; // Function to log the user out.
  loading: boolean; // Tracks if the app is currently checking for an existing session.
}

// CONTEXT CREATION
// REQUIREMENT: Initialize React Context. IMPORTANCE: Creates the "container" that will hold the auth data.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AUTH PROVIDER COMPONENT
 * REQUIREMENT: State Wrapper.
 * IMPORTANCE: This component wraps the whole app and manages the "Source of Truth" for authentication.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // State for user data.
  const [token, setToken] = useState<string | null>(null); // State for security token.
  const [loading, setLoading] = useState(true); // UX: Prevents redirecting before we know if the user is logged in.

  // SESSION PERSISTENCE (Runs once on app startup)
  // REQUIREMENT: Hydrate state. IMPORTANCE: Checks browser storage (localStorage) so users stay logged in even if they refresh the page.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser)); // Restore user object.
      setToken(storedToken); // Restore token.
    }
    setLoading(false); // Finished checking; app is ready.
  }, []);

  /**
   * LOGIN FUNCTION
   * REQUIREMENT: Session initiation.
   * IMPORTANCE: Updates app state AND browser storage when a user successfully signs in.
   */
  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user)); // Save to browser storage for persistence.
    localStorage.setItem('token', token);
  };

  /**
   * LOGOUT FUNCTION
   * REQUIREMENT: Session termination.
   * IMPORTANCE: Clears all user data from app state and browser storage for security.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user'); // Wipe browser storage.
    localStorage.removeItem('token');
  };

  // PROVIDE DATA TO CHILDREN
  // IMPORTANCE: Actually shares the values with the rest of the app.
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * CUSTOM USEAUTH HOOK
 * REQUIREMENT: Convenient access.
 * IMPORTANCE: A shorthand way for any component to grab the auth data (e.g., const { user } = useAuth()).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // REQUIREMENT: Developer error handling. IMPORTANCE: Ensures developers remember to wrap the app in <AuthProvider>.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
