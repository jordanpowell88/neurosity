import React, { useState, useEffect } from 'react';
import { useLocation, navigate } from '@reach/router';
import { useNotion } from '../services/notion';

export function useShowNavigation() {
    const [showCalm, setShowCalm] = useState(false);
    const [showKinesis, setShowKinesis] = useState(true);
    const [showFocus, setShowFocus] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setShowCalm(false);
            setShowKinesis(true);
            setShowFocus(true);
        }

        if (location.pathname === '/kinesis') {
            setShowKinesis(false);
            setShowCalm(true);
            setShowFocus(true);
        }

        if (location.pathname === '/focus') {
            setShowFocus(false);
            setShowKinesis(true);
            setShowCalm(true);
        }

    }, [location]);

    return { showCalm, showKinesis, showFocus }; 
}

export function Navigation() {
    const { showCalm, showKinesis, showFocus } = useShowNavigation();
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
    
      function goToKinesis() {
        navigate('/kinesis');
      }

      function goToFocus() {
        navigate('/focus');
      }

    return (
        <>
            { showCalm ? <button onClick={goToHome} className="card-btn">Calm</button> : null }
            { showFocus ? <button onClick={goToFocus} className="card-btn">Focus</button> : null }
            { showKinesis ? <button onClick={goToKinesis} className="card-btn">Kinesis</button> : null }
            <button onClick={goToLogout} className="card-btn">Logout</button>
        </>
    )
}