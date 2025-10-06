import React, { useEffect, useRef } from "react";
import p5 from "p5";

const ProjectileMotion = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let t = 0;
      let angle = 45;
      let speed = 50;
      const g = 9.8;

      p.setup = () => {
        p.createCanvas(600, 400);
      };

      p.draw = () => {
        p.background(10, 10, 30);
        p.fill(255);
        p.textSize(16);
        p.text("Projectile Motion Simulation", 10, 25);
        p.text(`Angle: ${angle}° | Speed: ${speed} m/s`, 10, 45);

        let vx = speed * Math.cos(p.radians(angle));
        let vy = speed * Math.sin(p.radians(angle)) - g * t;
        let x = vx * t;
        let y = 400 - (speed * Math.sin(p.radians(angle)) * t - 0.5 * g * t * t);

        p.fill(0, 255, 200);
        p.ellipse(x, y, 20, 20);

        if (y >= 400) t = 0;
        else t += 0.05;
      };
    };

    const myp5 = new p5(sketch, sketchRef.current);
    return () => myp5.remove();
  }, []);

  return <div ref={sketchRef}></div>;
};

export default ProjectileMotion;