import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Pendulum3D = ({ length = 2, mass = 1, resetKey = 0, onDataUpdate }) => {
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
    camera.position.set(length * 2, length * 2, length * 2);
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

    // Pivot at origin
    const pivot = new THREE.Object3D();
    scene.add(pivot);

    // Rod
    const rodMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const rodGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -length, 0),
    ]);
    const rod = new THREE.Line(rodGeometry, rodMaterial);
    pivot.add(rod);

    // Bob (sphere)
    const bobRadius = Math.max(0.1, length * 0.1); // dynamic size
    const bobGeometry = new THREE.SphereGeometry(bobRadius, 32, 32);
    const bobMaterial = new THREE.MeshPhongMaterial({ color: 0xff5555 });
    const bob = new THREE.Mesh(bobGeometry, bobMaterial);
    bob.position.set(0, -length, 0);
    pivot.add(bob);

    // Physics
    const g = 9.8;
    let theta = Math.PI / 6; // initial angle
    let omega = 0;
    const dt = 0.02;

    const animate = () => {
      if (stopRef.current) return;

      const alpha = (-g / length) * Math.sin(theta);
      omega += alpha * dt;
      theta += omega * dt;

      // Update pivot rotation
      pivot.rotation.z = theta;

      // Update bob position
      bob.position.set(length * Math.sin(theta), -length * Math.cos(theta), 0);

      // Send data
      if (onDataUpdate) onDataUpdate({ theta, phi: 0 });

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
  }, [length, mass, resetKey, onDataUpdate]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default Pendulum3D;