import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// A rotating sun component
const Sun = () => {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={[2, 2, -2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} />
      <pointLight intensity={2} distance={10} />
    </mesh>
  );
};

// Rain particle system
const Rain = ({ count = 500 }) => {
  const points = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; 
      pos[i * 3 + 1] = Math.random() * 20;     
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
        // Simple continuous fall effect
        points.current.position.y -= delta * 15;
        if (points.current.position.y < -15) {
            points.current.position.y = 10;
        }
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#aaccff" size={0.15} transparent opacity={0.6} />
    </points>
  );
};

const WeatherScene = ({ weatherCondition }) => {
  const condition = (weatherCondition || 'clear').toLowerCase();

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      
      {/* Always show stars in background for depth */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {(condition.includes('clear') || condition === 'sunny') && <Sun />}
      
      {(condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist') || condition.includes('fog')) && (
        <>
          <Cloud position={[-4, -2, -10]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, 2, -5]} speed={0.2} opacity={0.5} />
          <Cloud position={[0, 5, -15]} speed={0.2} opacity={0.5} />
        </>
      )}

      {(condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) && (
        <>
           <Cloud position={[0, 8, -5]} speed={0.1} opacity={0.9} color="#444" />
           <Rain count={800} />
           {condition.includes('thunderstorm') && (
             <Sparkles count={10} scale={15} size={10} speed={2} opacity={1} color="#ffff00" noise={1} />
           )}
        </>
      )}
      
      {condition.includes('snow') && (
         <Sparkles count={500} scale={10} size={2} speed={0.2} opacity={0.8} color="#fff" />
      )}
       
       {/* Fallback */}
       {!condition.includes('clear') && !condition.includes('cloud') && !condition.includes('rain') && !condition.includes('snow') && !condition.includes('drizzle') && !condition.includes('mist') && (
          <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.5} color="#fff" />
       )}
    </>
  );
};

export default WeatherScene;
