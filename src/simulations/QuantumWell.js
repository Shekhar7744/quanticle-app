import React, { useEffect, useRef } from "react";
import p5 from "p5";

const QuantumWell = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(600, 400);
      };

      p.draw = () => {
        p.background(10, 10, 30);
        p.stroke(255);
        p.noFill();

        // potential well
        p.rect(150, 100, 300, 200);

        // wave function
        p.beginShape();
        for (let x = 150; x <= 450; x++) {
          let wave = Math.sin((x - 150) * 0.05) * 50;
          p.vertex(x, 200 + wave);
        }
        p.endShape();

        p.fill(0, 255, 200);
        p.textSize(16);
        p.text("Quantum Particle in a Box", 10, 25);
      };
    };

    const myp5 = new p5(sketch, sketchRef.current);
    return () => myp5.remove();
  }, []);

  return <div ref={sketchRef}></div>;
};

export default QuantumWell;