"use client"
import { KeyboardControls, PointerLockControls, Sky, useTexture } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { CuboidCollider, Physics, RigidBody, type RigidBodyProps } from "@react-three/rapier"
import { useEffect, useState } from "react"
import * as THREE from "three"
import { Button } from "~/components/ui/button"
import { Player } from "./Player"

export function NoQuarterWorld() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!isReady) return <div />

  return (
    <div className="relative">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas shadows camera={{ fov: 45, position: [0, 5, 10] }} style={{ height: "100vh", width: "100vw" }}>
          <Sky sunPosition={[100, 20, 100]} />

          <pointLight castShadow intensity={0.5} position={[100, 10, 100]} />
          <hemisphereLight intensity={0.8} />

          <Physics gravity={[0, -9.81, 0]}>
            <Ground />
            <Player />
          </Physics>
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-2 bg-white/50 rounded-full" />
      </div>
      <div className="absolute bg-black bottom-2 left-2 p-2 flex flex-col items-center justify-center gap-2">
        <p>Click to Move</p>
        <p>WASD to Move</p>
        <p>Space to Jump</p>
      </div>
    </div>
  )
}

function Ground(props: RigidBodyProps) {
  const texture = useTexture("/assets/grass.jpg")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(10, 10) // Adjust this value to control the repetition of the texture

  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100, 100]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  )
}
