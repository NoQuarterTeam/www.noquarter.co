"use client"
import { KeyboardControls, OrbitControls, Sky, Stats, useKeyboardControls, useTexture } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { BallCollider, Physics, type RapierRigidBody, RigidBody, type RigidBodyProps } from "@react-three/rapier"
import { Suspense, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

function Tree({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position
  const adjustedPosition: [number, number, number] = [x, y + 3, z] // Lifted the tree by 2 units

  return (
    <RigidBody type="fixed" position={adjustedPosition}>
      <group scale={2}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
          <meshStandardMaterial color="brown" />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 3, 0]}>
          <coneGeometry args={[1.5, 4, 8]} />
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

const SPEED = 8
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

function PlayerWithCamera() {
  const playerRef = useRef<RapierRigidBody>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const [_, get] = useKeyboardControls()

  useFrame((state) => {
    const { forward, backward, left, right, jump } = get()

    if (!playerRef.current || !controlsRef.current) return

    const velocity = playerRef.current.linvel()

    // movement
    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED)
    direction.applyQuaternion(state.camera.quaternion)
    direction.y = 0 // Ensure movement is always on the same plane

    const position = playerRef.current.translation()
    // @ts-ignore
    playerRef.current.setLinvel({ x: direction.x, y: jump ? 10 : velocity.y, z: direction.z })
    controlsRef.current.target.set(position.x, position.y, position.z)
  })

  return (
    <>
      <RigidBody ref={playerRef} mass={1} type="dynamic" position={[0, 5, 0]}>
        <BallCollider args={[1]} />
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      </RigidBody>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={[2, 2, 2]}
        minDistance={6}
        maxDistance={10}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
    </>
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
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas shadows style={{ height: "100vh", width: "100vw" }} frameloop="demand">
          <Stats />
          <Sky sunPosition={[50, 40, 50]} rayleigh={0.2} />
          <hemisphereLight intensity={0.5} />
          <directionalLight castShadow intensity={1} position={[50, 40, 50]} shadow-mapSize={[4000, 4000]}>
            <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
          </directionalLight>
          <Suspense fallback={null}>
            <Physics>
              <Ground />
              <PlayerWithCamera />

              <Wall position={[0, 0, -25]} scale={[50, 5, 1]} />
              <Wall position={[0, 0, 25]} scale={[50, 5, 1]} />
              <Wall position={[-25, 0, 0]} scale={[1, 5, 50]} />
              <Wall position={[25, 0, 0]} scale={[1, 5, 50]} />

              {/* Add many randomized cubes */}
              {Array.from({ length: 50 }).map((_, i) => {
                const x = Math.random() * 50 - 25
                const y = Math.random() * 30 + 5
                const z = Math.random() * 50 - 25
                const scale = Math.random() * 1.5 + 0.5

                return (
                  <Cube
                    key={i}
                    position={[x, y, z]}
                    scale={[scale, scale, scale]}
                    color={`hsl(${Math.random() * 30 + 15}, 100%, ${Math.random() * 30 + 35}%)`}
                  />
                )
              })}

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
        <p>Arrow Keys or WASD to Move</p>
        <p>Space to Jump</p>
        <p>Mouse to Rotate Camera</p>
      </div>
    </div>
  )
}

function Ground(props: RigidBodyProps) {
  const texture = useTexture("/assets/grass.jpg")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(40, 40)

  return (
    <RigidBody {...props} type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[50, 1, 50]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </RigidBody>
  )
}

function Wall({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  const brickTexture = useTexture("/assets/bricks.jpg")
  brickTexture.wrapS = brickTexture.wrapT = THREE.RepeatWrapping
  brickTexture.repeat.set(10, 1)

  const adjustedPosition: [number, number, number] = [position[0], position[1] + 1, position[2]]

  return (
    <RigidBody type="fixed" position={adjustedPosition}>
      <mesh scale={scale} receiveShadow castShadow>
        <boxGeometry />
        <meshStandardMaterial map={brickTexture} />
      </mesh>
    </RigidBody>
  )
}

function Cube({
  position,
  scale,
  color,
}: { position: [number, number, number]; scale: [number, number, number]; color: string }) {
  const [x, y, z] = position
  const adjustedPosition: [number, number, number] = [x, y + 0.5, z]

  return (
    <RigidBody
      type="dynamic"
      friction={0.1}
      restitution={0.5}
      mass={0.1}
      position={adjustedPosition}
      rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
    >
      <mesh receiveShadow castShadow scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
