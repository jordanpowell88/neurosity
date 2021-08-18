import React, { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { useNotion, notion } from "../services/notion";
import { map } from 'rxjs/operators';

export function useKinesis(predictionType) {
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

    return { user, probability };
}

export function Kinesis() {
    const [predictionType, setPredictionType] = useState('leftFoot');
    const { user, probability } = useKinesis(predictionType);

    return (
        <main className="main-container">
            { user ? <Nav /> : null }
            <div className="calm-score">
                &nbsp; {probability}% <div className="calm-word">Probability</div>
            </div>
            
            <select onChange={e => setPredictionType(e.target.value)}>
                <option value="leftFoot">Left Foot</option>
                <option value="bitingALemon">Biting A Lemon</option>
            </select>
        </main>
    );
}