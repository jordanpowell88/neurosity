import React, { useState, useEffect } from 'react';
import { useLocation, navigate } from '@reach/router';
import { useNotion } from '../services/notion';

export function useShowNavigation() {
    const [showCalm, setShowCalm] = useState(false);
    const [showPredictions, setShowPredictions] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setShowCalm(false);
            setShowPredictions(true);
        }

        if (location.pathname === '/predictions') {
            setShowPredictions(false);
            setShowCalm(true);
        }

    }, [location]);

    return { showCalm, showPredictions }; 
}

export function Navigation() {
    const { showCalm, showPredictions } = useShowNavigation();
    const { user } = useNotion();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    function goToLogout() {
        navigate("/logout");
      }
    
      function goToHome() {
        navigate("/");
      }
    
      function goToPredictions() {
        navigate('/predictions');
      }

    return (
        <>
            { showCalm ? <button onClick={goToHome} className="card-btn">Calm</button> : null }
            { showPredictions ? <button onClick={goToPredictions} className="card-btn">Predictions</button> : null }
            <button onClick={goToLogout} className="card-btn">Logout</button>
        </>
    )
}