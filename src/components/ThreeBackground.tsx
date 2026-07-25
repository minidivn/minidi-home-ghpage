import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 200;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // 4. Generate Graph Nodes (Particles)
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const nodeColors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0xec4899), // Pink
    ];

    for (let i = 0; i < particleCount; i++) {
      // Random coordinates in space
      const x = (Math.random() - 0.5) * 350;
      const y = (Math.random() - 0.5) * 350;
      const z = (Math.random() - 0.5) * 350;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Assign palette color
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      nodeColors[i * 3] = color.r;
      nodeColors[i * 3 + 1] = color.g;
      nodeColors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));

    // Create glowing point sprites
    const pMaterial = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // 5. Generate Lines (Edges) between close nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });

    const lineIndices: number[] = [];
    const maxDistance = 60; // Max distance to establish line link

    for (let i = 0; i < particleCount; i++) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];

      for (let j = i + 1; j < particleCount; j++) {
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];

        // Euclidean distance check
        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        if (dist < maxDistance) {
          lineIndices.push(i, j);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    lineGeometry.setIndex(lineIndices);

    const edges = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(edges);

    // 6. Handle Mouse Movements (Parallax)
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) - 0.5;
      mouseRef.current.y = (event.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 7. Handle Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate graph slowly
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;
      edges.rotation.y += 0.0008;
      edges.rotation.x += 0.0003;

      // Parallax camera easing
      camera.position.x += (mouseRef.current.x * 80 - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y * 80 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      lineGeometry.dispose();
      pMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "#030712",
      }}
    />
  );
};
