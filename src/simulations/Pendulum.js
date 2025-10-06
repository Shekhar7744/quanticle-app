import React, { useEffect, useRef } from "react";
import p5 from "p5";

const Pendulum = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let origin, bob, len = 150, angle = Math.PI / 4, aVel = 0, aAcc = 0, g = 0.4;

      p.setup = () => {
        p.createCanvas(600, 400);
        origin = p.createVector(p.width / 2, 50);
        bob = p.createVector();
      };

      p.draw = () => {
        p.background(10, 10, 30);
        aAcc = (-1 * g / len) * Math.sin(angle);
        aVel += aAcc;
        angle += aVel;
        aVel *= 0.99; // damping

        bob.set(len * Math.sin(angle), len * Math.cos(angle), 0);
        bob.add(origin);

        p.stroke(255);
        p.line(origin.x, origin.y, bob.x, bob.y);
        p.fill(0, 255, 200);
        p.ellipse(bob.x, bob.y, 40, 40);
        p.textSize(16);
        p.text("Simple Pendulum", 10, 25);
      };
    };

    const myp5 = new p5(sketch, sketchRef.current);
    return () => myp5.remove();
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Pendulum;