import React, { useState, useEffect } from "react";
import { Nav } from '../components/Nav';
import { notion, useNotion } from "../services/notion";
import { map } from 'rxjs/operators';

function useFocus() {
    const { user } = useNotion();
    const [focus, setFocus] = useState(0);

    useEffect(() => {
        if (!user) {
            return;
        }

        const subscription = notion.focus().pipe(
            map(focus => focus.probability),
            map(probability => Math.trunc(probability * 100)),
        ).subscribe(probability => setFocus(probability));

        return () => subscription.unsubscribe();

    }, [user]);

    return { focus, user };
}

export function Focus() {
    const { user, focus } = useFocus();

    return (
        <main className="main-container">
          {user ? <Nav /> : null}
          <div className="calm-score">
            &nbsp;{focus}% <div className="calm-word">Focus</div>
          </div>
        </main>
      );
}