import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 3D Nodes definition for Evidence -> Skills -> Career Roles
const NODES_DATA = [
  // Evidence Layer (Left, X: -4 to -3) - Emerald
  { id: 'e1', name: 'Capstone Project', type: 'evidence', pos: [-4.2, 1.8, 0], color: '#10b981', size: 0.35, desc: 'Real GitHub Repo' },
  { id: 'e2', name: 'Competency Rubric', type: 'evidence', pos: [-4.5, 0.4, 0.5], color: '#10b981', size: 0.35, desc: 'Peer & Mentor Review' },
  { id: 'e3', name: 'Figma Portfolio', type: 'evidence', pos: [-4.1, -1.1, -0.4], color: '#10b981', size: 0.35, desc: 'Verified Case Study' },
  { id: 'e4', name: 'Self Interest', type: 'evidence', pos: [-4.4, -2.4, 0.2], color: '#10b981', size: 0.35, desc: 'Expressed Passion' },

  // Skills Layer (Middle, X: -1 to 1) - Cyan
  { id: 's1', name: 'Python & Pandas', type: 'skill', pos: [-1.2, 2.2, 0.3], color: '#00f0ff', size: 0.45, desc: 'Data wrangling & ML' },
  { id: 's2', name: 'React & UI Dev', type: 'skill', pos: [-0.6, 0.8, -0.6], color: '#00f0ff', size: 0.45, desc: 'Component architecture' },
  { id: 's3', name: 'SQL & Warehousing', type: 'skill', pos: [-0.9, -0.6, 0.4], color: '#00f0ff', size: 0.45, desc: 'Relational data modeling' },
  { id: 's4', name: 'User Research', type: 'skill', pos: [-0.4, -1.8, -0.3], color: '#00f0ff', size: 0.45, desc: 'Empathy & usability testing' },
  { id: 's5', name: 'Cloud & Docker', type: 'skill', pos: [0.8, 1.4, -0.4], color: '#00f0ff', size: 0.45, desc: 'Deployment pipelines' },
  { id: 's6', name: 'Statistics & Math', type: 'skill', pos: [0.5, -0.2, 0.7], color: '#00f0ff', size: 0.45, desc: 'Hypothesis testing' },

  // Careers Layer (Right, X: 3.5 to 4.5) - Purple
  { id: 'c1', name: 'Data Analyst', type: 'career', pos: [3.8, 2.2, 0.2], color: '#a855f7', size: 0.55, desc: '88% Evidence Match' },
  { id: 'c2', name: 'Full-Stack Dev', type: 'career', pos: [4.2, 0.6, -0.5], color: '#a855f7', size: 0.55, desc: '82% Evidence Match' },
  { id: 'c3', name: 'UX Designer', type: 'career', pos: [3.6, -1.0, 0.3], color: '#a855f7', size: 0.55, desc: '79% Evidence Match' },
  { id: 'c4', name: 'ML Engineer', type: 'career', pos: [4.3, -2.4, -0.2], color: '#a855f7', size: 0.55, desc: '74% Evidence Match' },
];

// Directed Connections: Evidence -> Skills -> Careers
const EDGES_DATA = [
  // Evidence -> Skills
  { from: 'e1', to: 's1' },
  { from: 'e1', to: 's2' },
  { from: 'e1', to: 's5' },
  { from: 'e2', to: 's3' },
  { from: 'e2', to: 's6' },
  { from: 'e3', to: 's2' },
  { from: 'e3', to: 's4' },
  { from: 'e4', to: 's1' },
  { from: 'e4', to: 's6' },

  // Skills -> Careers
  { from: 's1', to: 'c1' },
  { from: 's3', to: 'c1' },
  { from: 's6', to: 'c1' },
  { from: 's2', to: 'c2' },
  { from: 's5', to: 'c2' },
  { from: 's4', to: 'c3' },
  { from: 's2', to: 'c3' },
  { from: 's1', to: 'c4' },
  { from: 's5', to: 'c4' },
  { from: 's6', to: 'c4' },
];

function NetworkGraph({ hoveredNode, setHoveredNode }) {
  const groupRef = useRef();

  // Gentle floating animation & mouse parallax
  useFrame(({ clock, pointer }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.25 + Math.sin(clock.getElapsedTime() * 0.3) * 0.08,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.15 + Math.cos(clock.getElapsedTime() * 0.2) * 0.05,
        0.05
      );
    }
  });

  // Calculate edge lines geometry
  const lineSegments = useMemo(() => {
    const nodeMap = new Map(NODES_DATA.map((n) => [n.id, n]));
    return EDGES_DATA.map((edge) => {
      const src = nodeMap.get(edge.from);
      const dst = nodeMap.get(edge.to);
      if (!src || !dst) return null;
      return {
        key: `${edge.from}-${edge.to}`,
        from: edge.from,
        to: edge.to,
        points: [new THREE.Vector3(...src.pos), new THREE.Vector3(...dst.pos)],
        color: src.color,
      };
    }).filter(Boolean);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Edge Lines */}
      {lineSegments.map((edge) => {
        const isHighlighted =
          hoveredNode && (hoveredNode.id === edge.from || hoveredNode.id === edge.to);
        const geo = new THREE.BufferGeometry().setFromPoints(edge.points);
        return (
          <line key={edge.key} geometry={geo}>
            <lineBasicMaterial
              color={isHighlighted ? '#ffffff' : edge.color}
              transparent
              opacity={isHighlighted ? 0.9 : 0.22}
              linewidth={isHighlighted ? 2 : 1}
            />
          </line>
        );
      })}

      {/* Nodes */}
      {NODES_DATA.map((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const isConnected =
          hoveredNode &&
          EDGES_DATA.some(
            (e) =>
              (e.from === hoveredNode.id && e.to === node.id) ||
              (e.to === hoveredNode.id && e.from === node.id)
          );

        return (
          <Float key={node.id} speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <group position={node.pos}>
              {/* Outer Glow Halo */}
              <Sphere args={[node.size * 1.6, 16, 16]}>
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={isHovered ? 0.35 : isConnected ? 0.2 : 0.08}
                />
              </Sphere>

              {/* Core Sphere */}
              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredNode(node);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredNode(null);
                }}
                scale={isHovered ? 1.25 : 1}
              >
                <sphereGeometry args={[node.size, 32, 32]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={isHovered ? 0.9 : 0.4}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>

              {/* HTML 3D Floating Label */}
              <Html
                position={[0, node.size + 0.3, 0]}
                center
                distanceFactor={10}
                className="pointer-events-none select-none transition-all duration-200"
              >
                <div
                  className={`px-2 py-1 rounded-md text-[11px] font-mono whitespace-nowrap shadow-lg border transition-all ${
                    isHovered
                      ? 'bg-surface-900/95 text-white border-brand-400 scale-110 shadow-brand-500/30'
                      : isConnected
                      ? 'bg-surface-900/80 text-brand-300 border-surface-700'
                      : 'bg-surface-950/60 text-surface-400 border-surface-800/60'
                  }`}
                >
                  <div className="font-semibold">{node.name}</div>
                  {isHovered && (
                    <div className="text-[9px] text-surface-400 font-sans tracking-wide">
                      {node.desc}
                    </div>
                  )}
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
    </group>
  );
}

// Background particle dust
function ParticleDust({ count = 120 }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 16;
      coords[i + 1] = (Math.random() - 0.5) * 10;
      coords[i + 2] = (Math.random() - 0.5) * 8;
    }
    return coords;
  }, [count]);

  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00f0ff"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function SkillNetwork3D({ className = 'h-[460px] w-full' }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className={`relative rounded-2xl overflow-hidden glass-card border-surface-700/60 ${className}`}>
      {/* Canvas Layer */}
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#8b5cf6" />
        <ParticleDust />
        <NetworkGraph hoveredNode={hoveredNode} setHoveredNode={setHoveredNode} />
      </Canvas>

      {/* Layer legend overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 text-xs font-mono pointer-events-none bg-surface-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald shadow-sm shadow-emerald-500/50" />
          <span className="text-surface-300">1. Evidence</span>
        </div>
        <span className="text-surface-600">→</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400 shadow-sm shadow-brand-500/50" />
          <span className="text-surface-300">2. Skills</span>
        </div>
        <span className="text-surface-600">→</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-500/50" />
          <span className="text-surface-300">3. Career Match</span>
        </div>
      </div>

      {/* Live Node Focus Card */}
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 z-10 bg-surface-900/90 backdrop-blur-md border border-brand-500/40 px-3.5 py-2 rounded-xl shadow-xl max-w-[240px] pointer-events-none animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: hoveredNode.color }}
            />
            <span className="text-xs font-bold font-mono text-white capitalize">
              {hoveredNode.type}: {hoveredNode.name}
            </span>
          </div>
          <p className="text-[11px] text-surface-300">{hoveredNode.desc}</p>
        </div>
      )}

      {/* Hint pill */}
      <div className="absolute bottom-4 left-4 z-10 text-[11px] text-surface-400 font-mono bg-surface-950/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-surface-800/80 pointer-events-none">
        Hover nodes to trace verified evidence chains
      </div>
    </div>
  );
}
