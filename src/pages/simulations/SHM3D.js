import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const SHM3D = ({ amplitude = 2, frequency = 0.5, resetKey = 0, onDataUpdate }) => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    stopRef.current = false;
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(amplitude * 3, amplitude * 3, amplitude * 3);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    const ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    // Particle (mass)
    const particleRadius = Math.max(0.1, amplitude * 0.1);
    const particleGeometry = new THREE.SphereGeometry(particleRadius, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);

    // Physics
    const omega = 2 * Math.PI * frequency;
    let t = 0;
    const dt = 0.02;

    const animate = () => {
      if (stopRef.current) return;

      const x = amplitude * Math.sin(omega * t);
      const y = amplitude * Math.sin(omega * t + Math.PI / 2);
      const z = amplitude * Math.sin(omega * t + Math.PI / 4);

      particle.position.set(x, y, z);

      if (onDataUpdate) onDataUpdate({ x, y, z });

      t += dt;
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      stopRef.current = true;
      cancelAnimationFrame(animationRef.current);
      renderer.forceContextLoss();
      renderer.domElement.remove();
      renderer.dispose();
    };
  }, [amplitude, frequency, resetKey, onDataUpdate]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default SHM3D;