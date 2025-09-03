
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../../firebase/firebase.init';



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //user create | register
    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // user login
    const loginUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    //user logout
    const logOut = () => {
        setLoading(true)
        return signOut(auth)
    }

    // user displayName and photourl update
    const updateUserProfile = userprofile => {
        return updateProfile(auth.currentUser, userprofile);
    }

    //current user check 
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)


        })
        return () => {
            unSubscribe();
        }

    }, [])

    const authInfo = {
        user,
        loading,
        setUser,
        createUser,
        loginUser,
        logOut,
        updateUserProfile
    }
    return (

        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;