import { createContext, useContext, useState, useEffect } from 'react';
import { seedDatabase } from '../utils/seeder';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check session storage on mount
        const session = sessionStorage.getItem('garage-auth-session');
        if (session === 'active') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (pin) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay for effect
            setTimeout(() => {
                if (pin === '2121') {
                    sessionStorage.setItem('garage-auth-session', 'active');
                    setIsAuthenticated(true);
                    resolve(true);
                } else if (pin === '7777') {
                    // Demo Mode
                    sessionStorage.setItem('garage-auth-session', 'active');
                    seedDatabase(); // This will reload the page
                    resolve(true);
                } else {
                    reject(new Error('Invalid PIN'));
                }
            }, 800); // 800ms delay for "processing" effect
        });
    };

    const logout = () => {
        sessionStorage.removeItem('garage-auth-session');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
