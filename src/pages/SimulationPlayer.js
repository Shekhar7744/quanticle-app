import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import { useBox, useSphere } from '@react-three/cannon';

function Plane() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
}

// Component to spawn an object
function SpawnedObject({ cfg, position }) {
  const [boxRef] = useBox(() => ({ mass: cfg.mass, position }));
  const [sphereRef] = useSphere(() => ({ mass: cfg.mass, position }));

  const ref = cfg.shape === 'box' ? boxRef : sphereRef;
  const geo =
    cfg.shape === 'box'
      ? <boxGeometry />
      : <sphereGeometry args={[0.5, 32, 32]} />;

  return (
    <mesh ref={ref} castShadow>
      {geo}
      <meshStandardMaterial color={cfg.color} />
    </mesh>
  );
}

const SimulationPlayer = () => {
  const { id } = useParams();
  const [savedConfig, setSavedConfig] = useState(null);
  const [objects, setObjects] = useState([]); // store spawned objects

  // Toolbox state
  const [toolShape, setToolShape] = useState('box');
  const [toolMass, setToolMass] = useState(1);
  const [toolColor, setToolColor] = useState('#7b61ff');

  useEffect(() => {
    const loadConfig = async () => {
      const ref = doc(db, 'sandbox_contributions', id, 'config', 'settings');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSavedConfig(snap.data());
      }
    };
    loadConfig();
  }, [id]);

  const spawnObject = () => {
    // create a new object using toolbox values
    const newObj = {
      shape: toolShape,
      mass: Number(toolMass),
      color: toolColor,
      position: [0, 5, 0] // center
    };
    setObjects(prev => [...prev, newObj]);
  };

  if (!savedConfig) {
    return <div className="text-white p-6">Loading simulation...</div>;
  }

  return (
    <div className="h-screen bg-[#0b0c1e] relative">
      {/* Canvas + physics */}
      <Canvas shadows camera={{ position: [6, 6, 6], fov: 55 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} castShadow />
        <OrbitControls />
        <Physics gravity={savedConfig.gravity ? [0, -9.81, 0] : [0, 0, 0]}>
          <Plane />
          {/* Render all spawned objects */}
          {objects.map((obj, i) => (
            <SpawnedObject key={i} cfg={obj} position={obj.position} />
          ))}
        </Physics>
      </Canvas>

            {/* Toolbox (bottom right) */}
      <div className="absolute bottom-4 right-4 bg-[#1a1c2e] p-3 rounded-md border border-neonBlue text-white w-56">
        <h4 className="text-sm font-semibold mb-2">Spawn Object</h4>

        <label className="text-xs">Shape</label>
        <select
          value={toolShape}
          onChange={e => setToolShape(e.target.value)}
          className="w-full px-2 py-1 text-sm rounded bg-[#131426] mb-1 border border-gray-600"
        >
          <option value="box">Box</option>
          <option value="sphere">Sphere</option>
        </select>

        <label className="text-xs">Mass</label>
        <input
          type="number"
          value={toolMass}
          onChange={e => setToolMass(e.target.value)}
          className="w-full px-2 py-1 text-sm rounded bg-[#131426] mb-1 border border-gray-600"
        />

        <label className="text-xs">Color</label>
        <input
          type="color"
          value={toolColor}
          onChange={e => setToolColor(e.target.value)}
          className="w-full h-6 mb-2"
        />

        <button
          onClick={spawnObject}
          className="w-full bg-neonBlue text-black text-sm font-bold py-1 rounded hover:bg-white mb-2"
        >
          Spawn
        </button>

        {/* Reset */}
        <button
          onClick={() => setObjects([])}
          className="w-full bg-gray-600 text-white text-sm py-1 rounded hover:bg-gray-500"
        >
          Reset Scene
        </button>
       </div>   {/* ✅ closes the outer wrapper */}
    </div>
  );
};


export default SimulationPlayer;