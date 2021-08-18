import React from "react";

import { Status } from "./Status";
import { Footer } from "./Footer";
import { Navigation } from './Navigation';

export function Nav() {

  return (
    <nav className="card">
      <Status />
      <Navigation />
      <Footer />
    </nav>
  );
}
