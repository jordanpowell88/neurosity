import { navigate } from "@reach/router";
import React, { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { useNotion, notion } from "../services/notion";
import { map } from 'rxjs/operators';

function useProbability(predictionType) {
    const { user } = useNotion();
    const [probability, setProbability] = useState(0);

    useEffect(() => {
        if (!user) {
            return;
        }

        const subscription = notion.predictions(predictionType).pipe(
            map(predictions => predictions.probability),
            map(prob => Math.trunc(prob * 100)),
        ).subscribe(prob => setProbability(prob));
    
        return () => {
            subscription.unsubscribe();
        }
    }, [user, predictionType]);

    return probability;
}

export function Predications() {
    const { user } = useNotion();
    const [predictionType, setPredictionType] = useState('leftFoot');
    const probability = useProbability(predictionType);

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