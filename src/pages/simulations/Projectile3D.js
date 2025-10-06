import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Projectile3D = ({ angleXY, angleZ, speed, onDataUpdate, resetKey }) => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;
    stopRef.current = false;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(20, 15, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // Projectile (sphere)
    const projectileRadius = 0.5;
    const projectileGeometry = new THREE.SphereGeometry(projectileRadius, 32, 32);
    const projectileMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
    scene.add(projectile);

    // Physics
    const g = 9.8;
    const radXY = (angleXY * Math.PI) / 180;
    const radZ = (angleZ * Math.PI) / 180;
    const vx = speed * Math.cos(radXY) * Math.cos(radZ);
    const vz = speed * Math.cos(radXY) * Math.sin(radZ);
    const vy0 = speed * Math.sin(radXY);

    let t = 0;
    const dt = 0.02;

    const animate = () => {
      if (stopRef.current) return;

      const x = vx * t;
      const z = vz * t;
      const y = vy0 * t - 0.5 * g * t * t;

      if (y >= 0) {
        projectile.position.set(x, y, z);
        if (onDataUpdate) onDataUpdate({ x, y, z });
        t += dt;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // stop at ground
        projectile.position.set(x, 0, z);
        if (onDataUpdate) onDataUpdate({ x, y: 0, z });
        cancelAnimationFrame(animationRef.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      stopRef.current = true;
      cancelAnimationFrame(animationRef.current);
      renderer.forceContextLoss();
      renderer.domElement.remove();
      renderer.dispose();
    };
  }, [angleXY, angleZ, speed, resetKey, onDataUpdate]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default Projectile3D;