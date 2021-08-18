import React, { useEffect, useState } from "react";
import { combineLatest, pipe } from 'rxjs';
import { map, bufferTime, take, flatMap, tap } from "rxjs/operators";
import { Nav } from '../components/Nav';
import { notion, useNotion } from "../services/notion";

const calculateAverageFrequency = (array) => array.reduce((a, b) => a + b, 0) / array.length;

const handleEpoch = (epoch, key) => calculateAverageFrequency(epoch.data[key]).toFixed(0)

const calculateEpochBand = (key, duration) => pipe(
    map(data => handleEpoch(data, key)),
    bufferTime(duration),
    map(array => Array.from(array, a => Number(a))),
    map(array => calculateAverageFrequency(array).toFixed(0))
);

function useBrainwaves(speed) {
    const { user } = useNotion();
    const [alpha, setAlpha] = useState(0);
    const [beta, setBeta] = useState(0);
    const [delta, setDelta] = useState(0);
    const [gamma, setGamma] = useState(0);
    const [theta, setTheta] = useState(0);

    useEffect(() => {
        if (!user) {
            return;
        }

        const alpha$ = notion.brainwaves('powerByBand').pipe(
            calculateEpochBand('alpha', speed),
            tap(a => setAlpha(a)),
        );

        const beta$ = notion.brainwaves('powerByBand').pipe(
            calculateEpochBand('beta', speed),
            tap(beta => setBeta(beta)),
        );

        const delta$ = notion.brainwaves('powerByBand').pipe(
            calculateEpochBand('delta', speed),
            tap(delta => setDelta(delta)),
        );

        const gamma$ = notion.brainwaves('powerByBand').pipe(
            calculateEpochBand('gamma', speed),
            tap(gamma => setGamma(gamma)),
        );

        const theta$ = notion.brainwaves('powerByBand').pipe(
            calculateEpochBand('theta', speed),
            tap(theta => setTheta(theta)),
        );

        const subscriptions$ = [alpha$, beta$, delta$, gamma$, theta$];

        combineLatest(...subscriptions$).pipe(
            // take(1)
        ).subscribe();

        return () => subscriptions$.forEach(sub => sub.unsubscribe());
        
    }, [user]);

    return { user, alpha, beta, delta, gamma, theta };
}

export function Brainwaves() {
    const { user, alpha, beta, delta, gamma, theta } = useBrainwaves(1000);

    return (
        <main className="main-container">
          {user ? <Nav /> : null}
          <div className="band-score">
            &nbsp;{alpha}% <div className="calm-word">Alpha</div>
          </div>
          <div className="band-score">
            &nbsp;{beta}% <div className="calm-word">Beta</div>
          </div>
          <div className="band-score">
            &nbsp;{delta}% <div className="calm-word">Delta</div>
          </div>
          <div className="band-score">
            &nbsp;{gamma}% <div className="calm-word">Gamma</div>
          </div>
          <div className="band-score">
            &nbsp;{theta}% <div className="calm-word">Theta</div>
          </div>
        </main>
      );

}