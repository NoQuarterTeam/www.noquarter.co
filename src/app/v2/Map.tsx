"use client"
import { KeyboardControls, Sky, useTexture } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics, RigidBody, type RigidBodyProps } from "@react-three/rapier"
import { Suspense, useEffect, useState } from "react"
import * as THREE from "three"
import { Player } from "./Player"

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" position={position}>
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
          <meshStandardMaterial color="brown" />
        </mesh>
        <mesh castShadow position={[0, 1.5, 0]}>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </group>
    </RigidBody>
  )
}

function Slope({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <RigidBody type="fixed" position={position} rotation={rotation}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[10, 0.5, 10]} />
        <meshStandardMaterial color="tan" />
      </mesh>
    </RigidBody>
  )
}

export function NoQuarterWorld() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!isReady) return <div />

  return (
    <div className="relative">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["w", "W"] },
          { name: "backward", keys: ["s", "S"] },
          { name: "left", keys: ["a", "A"] },
          { name: "right", keys: ["d", "D"] },
          { name: "jump", keys: ["Space"] },
          { name: "rotateLeft", keys: ["ArrowLeft", "q", "Q"] },
          { name: "rotateRight", keys: ["ArrowRight", "e", "E"] },
          { name: "rotateUp", keys: ["ArrowUp"] },
          { name: "rotateDown", keys: ["ArrowDown"] },
        ]}
      >
        <Canvas shadows style={{ height: "100vh", width: "100vw" }}>
          <Sky sunPosition={[50, 40, 50]} rayleigh={0.2} />
          <hemisphereLight intensity={0.5} />
          <directionalLight castShadow intensity={1} position={[50, 40, 50]} shadow-mapSize={[4000, 4000]}>
            <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
          </directionalLight>
          <Suspense fallback={null}>
            <Physics>
              <Ground />
              <Player />

              <Wall position={[0, 0, -25]} scale={[50, 5, 1]} />
              <Wall position={[0, 0, 25]} scale={[50, 5, 1]} />
              <Wall position={[-25, 0, 0]} scale={[1, 5, 50]} />
              <Wall position={[25, 0, 0]} scale={[1, 5, 50]} />

              <Cube position={[0, 10, -5]} />
              <Cube position={[-7, 10, -3]} />
              <Cube position={[0, 10, 10]} />
              <Cube position={[10, 10, 10]} />
              <Cube position={[20, 10, 10]} />
              <Cube position={[0, 20, 10]} />
              <Cube position={[0, 30, 10]} />
              <Cube position={[20, 20, 10]} />

              {/* Add random trees */}
              <Tree position={[-15, 0, -15]} />
              <Tree position={[12, 0, 8]} />
              <Tree position={[-8, 0, 18]} />
              <Tree position={[18, 0, -10]} />
              <Tree position={[-20, 0, 5]} />
              <Tree position={[5, 0, -20]} />
              <Tree position={[-3, 0, 22]} />
              <Tree position={[22, 0, 3]} />

              {/* Add a slope */}
              <Slope position={[10, 1.5, 0]} rotation={[0, 0, Math.PI / 8]} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <div className="absolute bg-black bottom-2 left-2 p-2 flex flex-col items-center justify-center gap-2">
        <p>WASD to Move</p>
        <p>Arrows to Rotate</p>
        <p>Space to Jump</p>
      </div>
    </div>
  )
}

function Ground(props: RigidBodyProps) {
  const texture = useTexture("/assets/grass.jpg")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(40, 40)

  return (
    <RigidBody {...props} type="fixed" colliders="cuboid" position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
      <mesh receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </RigidBody>
  )
}

function Wall({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <RigidBody type="fixed" position={position}>
      <mesh scale={scale} receiveShadow castShadow>
        <boxGeometry />
        <meshStandardMaterial color="lightgray" />
      </mesh>
    </RigidBody>
  )
}

function Cube({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position
  const adjustedPosition: [number, number, number] = [x, y + 0.5, z]

  return (
    <RigidBody
      type="dynamic"
      friction={1} // Friction coefficient for physics interactions
      restitution={0.5} //
      mass={0.2}
      position={adjustedPosition}
      rotation={[0, 10, 0]}
    >
      <mesh receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  )
}
