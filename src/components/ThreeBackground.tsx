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
    scene.fog = new THREE.FogExp2(0x030712, 0.008);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 220;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // 4. Define Named Entities for the Graph
    const nodesData = [
      { name: "Vietnam", color: "#06b6d4", size: 38 },
      { name: "France", color: "#ec4899", size: 36 },
      { name: "Germany", color: "#8b5cf6", size: 34 },
      { name: "Paris", color: "#ec4899", size: 28 },
      { name: "Hanoi", color: "#06b6d4", size: 28 },
      { name: "Berlin", color: "#8b5cf6", size: 28 },
      { name: "History", color: "#34d399", size: 30 },
      { name: "Science", color: "#fbbf24", size: 32 },
      { name: "Mathematics", color: "#fbbf24", size: 28 },
      { name: "Physics", color: "#fbbf24", size: 28 },
      { name: "Wikidata", color: "#60a5fa", size: 32 },
      { name: "Wikipedia", color: "#60a5fa", size: 32 },
      { name: "Dynasties", color: "#34d399", size: 26 },
      { name: "Geography", color: "#34d399", size: 26 },
      { name: "Dictionary", color: "#a78bfa", size: 30 }
    ];

    // Helper to generate circular labels canvas texture
    const createNodeTexture = (name: string, color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Draw outer glowing circle
      ctx.beginPath();
      ctx.arc(128, 80, 42, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      // Inner glowing core
      ctx.beginPath();
      ctx.arc(128, 80, 15, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Write text label below the circle
      ctx.font = "bold 20px Inter, sans-serif";
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      ctx.fillText(name, 128, 160);

      return new THREE.CanvasTexture(canvas);
    };

    // Helper to generate glowing data packet texture
    const createPacketTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 14);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.3, "#06b6d4");
      grad.addColorStop(1, "rgba(6, 182, 212, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, 2 * Math.PI);
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    };

    const packetTexture = createPacketTexture();

    // 5. Position Nodes in 3D Space
    const nodeSprites: THREE.Sprite[] = [];
    const positions: THREE.Vector3[] = [];

    nodesData.forEach((node, i) => {
      const texture = createNodeTexture(node.name, node.color);
      if (!texture) return;

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.NormalBlending
      });

      const sprite = new THREE.Sprite(material);
      
      // Distribute nodes spherically
      const phi = Math.acos(-1 + (2 * i) / nodesData.length);
      const theta = Math.sqrt(nodesData.length * Math.PI) * phi;
      const radius = 130;

      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );

      sprite.position.copy(pos);
      // Scale sprite based on node size
      const scale = node.size * 0.75;
      sprite.scale.set(scale, scale, 1);

      scene.add(sprite);
      nodeSprites.push(sprite);
      positions.push(pos);
    });

    // 6. Create Connected Edges & Data Flow Packets
    const connections: { start: number; end: number }[] = [];
    const packets: { sprite: THREE.Sprite; start: number; end: number; progress: number; speed: number }[] = [];

    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const baseColor = new THREE.Color(0x8b5cf6);

    // Build edges (connect each node to its 2 nearest neighbors to create a multigraph)
    for (let i = 0; i < positions.length; i++) {
      const dists = positions.map((p, idx) => ({ idx, dist: positions[i].distanceTo(p) }));
      // Sort and take 2 nearest neighbors (skipping self at index 0)
      dists.sort((a, b) => a.dist - b.dist);
      
      const neighbors = [dists[1].idx, dists[2].idx];
      neighbors.forEach((nIdx) => {
        // Prevent duplicate connections in list
        const exists = connections.some(
          (c) => (c.start === i && c.end === nIdx) || (c.start === nIdx && c.end === i)
        );
        if (!exists) {
          connections.push({ start: i, end: nIdx });

          // Write vertices for line segments representation
          linePositions.push(positions[i].x, positions[i].y, positions[i].z);
          linePositions.push(positions[nIdx].x, positions[nIdx].y, positions[nIdx].z);
          
          lineColors.push(baseColor.r, baseColor.g, baseColor.b);
          lineColors.push(baseColor.r, baseColor.g, baseColor.b);

          // Instantiate a data flow packet traveling along this line
          if (packetTexture) {
            const pMat = new THREE.SpriteMaterial({
              map: packetTexture,
              transparent: true,
              blending: THREE.AdditiveBlending
            });
            const pSprite = new THREE.Sprite(pMat);
            pSprite.scale.set(6, 6, 1);
            scene.add(pSprite);

            packets.push({
              sprite: pSprite,
              start: i,
              end: nIdx,
              progress: Math.random(), // Randomize starting phase
              speed: 0.004 + Math.random() * 0.008
            });
          }
        }
      });
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x06b6d4, // Bright cyan
      transparent: true,
      opacity: 0.45, // Boosted opacity
      blending: THREE.NormalBlending // Normal blending for maximum visibility
    });

    const edges = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(edges);

    // 7. Mouse and Resize handlers
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) - 0.5;
      mouseRef.current.y = (event.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation & Easing Loop
    let animationFrameId: number;
    const rotationGroup = new THREE.Group();
    
    // Add all nodes, edges and packets to rotationGroup for uniform coordinates rotation
    nodeSprites.forEach((s) => rotationGroup.add(s));
    packets.forEach((p) => rotationGroup.add(p.sprite));
    rotationGroup.add(edges);
    scene.add(rotationGroup);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Spin the entire network graph
      rotationGroup.rotation.y += 0.0006;
      rotationGroup.rotation.x += 0.0002;

      // Animate flowing data packets along edge segments
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1.0) {
          p.progress = 0.0;
          // Reverse direction occasionally
          if (Math.random() > 0.5) {
            const temp = p.start;
            p.start = p.end;
            p.end = temp;
          }
        }

        const startPos = positions[p.start];
        const endPos = positions[p.end];

        // Linear interpolation to find packet coordinates
        p.sprite.position.lerpVectors(startPos, endPos, p.progress);
      });

      // Eased mouse camera movements
      camera.position.x += (mouseRef.current.x * 90 - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y * 90 - camera.position.y) * 0.05;
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
      lineGeometry.dispose();
      lineMaterial.dispose();
      nodeSprites.forEach((s) => {
        s.material.map?.dispose();
        s.material.dispose();
      });
      packets.forEach((p) => {
        p.sprite.material.map?.dispose();
        p.sprite.material.dispose();
      });
      packetTexture?.dispose();
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
        backgroundColor: "#030712"
      }}
    />
  );
};
