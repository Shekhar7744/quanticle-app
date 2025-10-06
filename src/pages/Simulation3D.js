import React, { useState } from "react";
import Projectile3D from "./simulations/Projectile3D";
import Pendulum3D from "./simulations/Pendulum3D";
import SHM3D from "./simulations/SHM3D";

const Simulation3D = () => {
  const [simType, setSimType] = useState("projectile");

  // Projectile
  const [angleXY, setAngleXY] = useState(45); // vertical angle
  const [angleZ, setAngleZ] = useState(0);    // horizontal rotation
  const [speed, setSpeed] = useState(10);

  // Pendulum
  const [length, setLength] = useState(2); 
  const [mass, setMass] = useState(1);

  // SHM
  const [amplitude, setAmplitude] = useState(2); 
  const [frequency, setFrequency] = useState(0.5);

  const [simData, setSimData] = useState({});
  const [resetKey, setResetKey] = useState(0);

  return (
    <div style={{ padding: "20px", color: "#fff", fontFamily: "Arial" }}>
      <h2>3D Physics Simulations</h2>

      {/* Simulation selector */}
      <div>
        <label>Select Simulation: </label>
        <select value={simType} onChange={(e) => setSimType(e.target.value)}>
          <option value="projectile">Projectile Motion</option>
          <option value="pendulum">Pendulum (3D)</option>
          <option value="shm">SHM (3D)</option>
        </select>
      </div>

      {/* Parameter controls */}
      {simType === "projectile" && (
        <div style={{ marginTop: "10px" }}>
          <label>Vertical Angle: {angleXY}°</label>
          <input
            type="range"
            min="0"
            max="90"
            value={angleXY}
            onChange={(e) => setAngleXY(Number(e.target.value))}
          />
          <label>Horizontal Angle: {angleZ}°</label>
          <input
            type="range"
            min="-90"
            max="90"
            value={angleZ}
            onChange={(e) => setAngleZ(Number(e.target.value))}
          />
          <label>Speed: {speed} m/s</label>
          <input
            type="range"
            min="1"
            max="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      )}

      {simType === "pendulum" && (
        <div style={{ marginTop: "10px" }}>
          <label>Length: {length} m</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
          <label>Mass: {mass} kg</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
          />
        </div>
      )}

      {simType === "shm" && (
        <div style={{ marginTop: "10px" }}>
          <label>Amplitude: {amplitude} m</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
          />
          <label>Frequency: {frequency} Hz</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.05"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
          />
        </div>
      )}

      {/* Reset button */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setResetKey(prev => prev + 1)}>
          Reset Simulation
        </button>
      </div>

      {/* Simulation canvas */}
      <div style={{ marginTop: "20px", width: "100%", height: "400px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 0 15px cyan" }}>
        {simType === "projectile" && (
          <Projectile3D
            angleXY={angleXY}
            angleZ={angleZ}
            speed={speed}
            resetKey={resetKey}
            onDataUpdate={setSimData}
          />
        )}
        {simType === "pendulum" && (
          <Pendulum3D
            length={length}
            mass={mass}
            resetKey={resetKey}
            onDataUpdate={setSimData}
          />
        )}
        {simType === "shm" && (
          <SHM3D
            amplitude={amplitude}
            frequency={frequency}
            resetKey={resetKey}
            onDataUpdate={setSimData}
          />
        )}
      </div>

      {/* Simulation Data */}
      <div style={{ marginTop: "10px" }}>
        <h3>Simulation Data:</h3>
        {simType === "projectile" && (
          <div>
            X: {simData?.x?.toFixed(2) ?? "-"} m
            <br />
            Y: {simData?.y?.toFixed(2) ?? "-"} m
            <br />
            Z: {simData?.z?.toFixed(2) ?? "-"} m
          </div>
        )}
        {simType === "pendulum" && (
          <div>
            θ: {simData?.theta ? (simData.theta * 180 / Math.PI).toFixed(2) : "-"}°
            <br />
            φ: {simData?.phi ? (simData.phi * 180 / Math.PI).toFixed(2) : "-"}°
          </div>
        )}
        {simType === "shm" && (
          <div>
            X: {simData?.x?.toFixed(2) ?? "-"} m
            <br />
            Y: {simData?.y?.toFixed(2) ?? "-"} m
            <br />
            Z: {simData?.z?.toFixed(2) ?? "-"} m
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation3D;