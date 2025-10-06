import React, { useState } from "react";
import { ProjectileMotion, Pendulum, QuantumWell } from "../simulations";

const SandboxLab = () => {
  const [selected, setSelected] = useState("projectile");

  const renderSimulation = () => {
    switch (selected) {
      case "projectile":
        return <ProjectileMotion />;
      case "pendulum":
        return <Pendulum />;
      case "quantum":
        return <QuantumWell />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 20, color: "white", background: "#0b0b1f", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 10 }}>🔬 Quanticle Sandbox Lab</h1>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      >
        <option value="projectile">Projectile Motion</option>
        <option value="pendulum">Simple Pendulum</option>
        <option value="quantum">Quantum Particle in a Box</option>
      </select>

      <div style={{ border: "2px solid #2a2a4f", borderRadius: "12px", padding: "10px" }}>
        {renderSimulation()}
      </div>
    </div>
  );
};

export default SandboxLab;