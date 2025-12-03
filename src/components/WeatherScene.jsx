import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// A rotating sun component
const Sun = () => {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5; // significantly faster rotation
      ref.current.rotation.x += delta * 0.2; // added slight tilt rotation
    }
  });
  return (
    <mesh ref={ref} position={[7, 5, -5]}>
       <sphereGeometry args={[2.5, 64, 64]} />
       <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={3} toneMapped={false} />
       <pointLight intensity={3} distance={25} decay={2} />
    </mesh>
  );
};

// Rain particle system
const Rain = ({ count = 2000 }) => {
  const points = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40; // Wider spread
      pos[i * 3 + 1] = Math.random() * 25;     
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
        // Much faster fall speed
        points.current.position.y -= delta * 35;
        if (points.current.position.y < -20) {
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
      <pointsMaterial color="#bfdbfe" size={0.15} transparent opacity={0.7} />
    </points>
  );
};

const WeatherScene = ({ weatherCondition }) => {
  const condition = (weatherCondition || 'clear').toLowerCase();

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />

      {(condition.includes('clear') || condition === 'sunny') && <Sun />}
      
      {(condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist') || condition.includes('fog')) && (
        <group>
          {/* Faster clouds */}
          <Cloud position={[-10, -2, -10]} speed={1.0} opacity={0.6} segments={30} width={15} depth={2} />
          <Cloud position={[10, 2, -12]} speed={1.2} opacity={0.6} segments={30} width={15} depth={2} />
          <Cloud position={[0, 8, -18]} speed={0.8} opacity={0.5} segments={30} width={20} />
          {/* Extra foreground cloud for depth */}
          <Cloud position={[-5, 6, -5]} speed={1.5} opacity={0.3} segments={15} scale={0.5} />
        </group>
      )}

      {(condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) && (
        <>
           <Cloud position={[0, 10, -10]} speed={1.5} opacity={0.95} color="#4a5568" width={20} />
           <Rain count={2000} />
           {condition.includes('thunderstorm') && (
             <Sparkles count={40} scale={25} size={20} speed={5} opacity={1} color="#ffff00" noise={2} position={[0, 5, -5]} />
           )}
        </>
      )}
      
      {condition.includes('snow') && (
         <Sparkles count={1000} scale={30} size={5} speed={2.5} opacity={0.9} color="#fff" />
      )}
       
       {/* Fallback */}
       {!condition.includes('clear') && !condition.includes('cloud') && !condition.includes('rain') && !condition.includes('snow') && !condition.includes('drizzle') && !condition.includes('mist') && (
          <Sparkles count={100} scale={15} size={3} speed={1} opacity={0.6} color="#fff" />
       )}
    </>
  );
};

export default WeatherScene;