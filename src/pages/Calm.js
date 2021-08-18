import React, { useState, useEffect } from "react";
import { notion, useNotion } from "../services/notion";
import { Nav } from "../components/Nav";
import { map } from 'rxjs/operators';

function useCalm() {
  const { user } = useNotion();
  const [calm, setCalm] = useState(user.calm);

  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = notion.calm().pipe(
      map(calm => calm.probability),
      map(probability => Math.trunc(probability * 100)),
    ).subscribe(probability => setCalm(probability));

    return () => subscription.unsubscribe();

  }, [user]);

  return { user, calm };
}

export function Calm() {
  const { user, calm } = useCalm();

  return (
    <main className="main-container">
      {user ? <Nav /> : null}
      <div className="calm-score">
        &nbsp;{calm}% <div className="calm-word">Calm</div>
      </div>
    </main>
  );
}
