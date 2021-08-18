import React, { useState, useEffect } from 'react';
import { useLocation, navigate } from '@reach/router';
import { useNotion } from '../services/notion';

export function useShowNavigation() {
    const [showCalm, setShowCalm] = useState(false);
    const [showPredictions, setShowPredictions] = useState(true);
    const [showFocus, setShowFocus] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setShowCalm(false);
            setShowPredictions(true);
            setShowFocus(true);
        }

        if (location.pathname === '/predictions') {
            setShowPredictions(false);
            setShowCalm(true);
            setShowFocus(true);
        }

        if (location.pathname === '/focus') {
            setShowFocus(false);
            setShowPredictions(true);
            setShowCalm(true);
        }

    }, [location]);

    return { showCalm, showPredictions, showFocus }; 
}

export function Navigation() {
    const { showCalm, showPredictions, showFocus } = useShowNavigation();
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

      function goToFocus() {
        navigate('/focus');
      }

    return (
        <>
            { showCalm ? <button onClick={goToHome} className="card-btn">Calm</button> : null }
            { showFocus ? <button onClick={goToFocus} className="card-btn">Focus</button> : null }
            { showPredictions ? <button onClick={goToPredictions} className="card-btn">Predictions</button> : null }
            <button onClick={goToLogout} className="card-btn">Logout</button>
        </>
    )
}