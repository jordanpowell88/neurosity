import { navigate } from "@reach/router";
import React, { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { useNotion, notion } from "../services/notion";
import { map } from 'rxjs/operators';

export function Predications() {
    const { user } = useNotion();
    const [predictionType, setPredictionType] = useState('leftFoot');
    const [probability, setProbability] = useState(0);
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const subscription = notion.predictions(predictionType).pipe(
            map(predictions => predictions.probability),
        ).subscribe(prob => setProbability(Math.trunc(prob * 100)));

        return () => {
            subscription.unsubscribe();
        }
    }, [user]);

    return (
        <main className="main-container">
            { user ? <Nav /> : null }
            <div className="calm-score">
                &nbsp; {probability}% <div className="calm-word">Probability</div>
            </div>
            
            <select onChange={setPredictionType}>
                <option value="leftFoot">Left Foot</option>
                <option value="bitingALemon">Biting A Lemon</option>
            </select>
        </main>
    );
}