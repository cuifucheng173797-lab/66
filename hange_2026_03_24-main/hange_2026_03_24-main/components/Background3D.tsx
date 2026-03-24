
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Background3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Setup ---
    const scene = new THREE.Scene();
    // We rely on the CSS background for the base color, but adding fog creates depth fading
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 800;
    camera.position.y = 200;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- 1. The Core Sphere (Dots) ---
    // Represents global nodes/data points
    const sphereGeo = new THREE.IcosahedronGeometry(300, 3);
    const sphereMat = new THREE.PointsMaterial({
      color: 0x2997ff, // Brand Klein Blue
      size: 2.5,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const spherePoints = new THREE.Points(sphereGeo, sphereMat);
    group.add(spherePoints);

    // --- 2. The Network Shell (Wireframe) ---
    // Represents connection lines
    const wireGeo = new THREE.IcosahedronGeometry(300, 1);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5, // Indigo
      transparent: true,
      opacity: 0.1,
    });
    const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeo), wireMat);
    wireframe.scale.setScalar(1.02); // Slightly larger than points
    group.add(wireframe);

    // --- 3. Data Rings (Particle Orbits) ---
    const createDataRing = (radius: number, count: number, color: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      
      for(let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        // Add some random variation for a "cloud" look
        const spread = 10; 
        positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5; // Flattened Y
        positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: color,
        size: 1.5,
        transparent: true,
        opacity: 0.6,
      });
      return new THREE.Points(geometry, material);
    };

    const ring1 = createDataRing(450, 400, 0x00ffff); // Cyan ring
    ring1.rotation.x = Math.PI / 6;
    ring1.rotation.y = Math.PI / 8;
    group.add(ring1);

    const ring2 = createDataRing(550, 600, 0x2997ff); // Blue ring
    ring2.rotation.x = -Math.PI / 8;
    group.add(ring2);

    // --- 4. Deep Space Stars ---
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsPos = new Float32Array(starsCount * 3);
    for(let i = 0; i < starsCount * 3; i++) {
      starsPos[i] = (Math.random() - 0.5) * 3000;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.3,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // --- Animation & Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.05;
      mouseY = (event.clientY - windowHalfY) * 0.05;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.0005;

      // 1. Core Rotation (Steady)
      spherePoints.rotation.y += 0.001;
      wireframe.rotation.y -= 0.0005;

      // 2. Rings Rotation (Dynamic)
      ring1.rotation.z += 0.001;
      ring1.rotation.y += 0.0005;
      
      ring2.rotation.z -= 0.0008;
      ring2.rotation.y -= 0.0002;

      // 3. Subtle Pulse
      const scale = 1 + Math.sin(time * 0.5) * 0.02;
      group.scale.set(scale, scale, scale);

      // 4. Parallax Camera Movement
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY + 200 - camera.position.y) * 0.05; // Keep y offset around 200
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Cleanup geometries
      sphereGeo.dispose();
      sphereMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1.geometry.dispose();
      (ring1.material as THREE.Material).dispose();
      ring2.geometry.dispose();
      (ring2.material as THREE.Material).dispose();
      starsGeo.dispose();
      starsMat.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" />;
};

export default Background3D;
