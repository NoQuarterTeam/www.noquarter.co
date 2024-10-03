"use client"
import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CapsuleCollider, RigidBody, type RigidBodyProps } from "@react-three/rapier"
import { useRef } from "react"
import * as THREE from "three"

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export function Player() {
  const playerRef = useRef<RigidBodyProps>(null)
  const [_, get] = useKeyboardControls()

  useFrame((state) => {
    const { forward, backward, left, right, jump } = get()
    if (!playerRef.current) return

    const velocity = playerRef.current.linvel()

    // update camera
    const position = playerRef.current.translation()
    state.camera.position.set(position.x, position.y, position.z)

    // movement
    frontVector.set(0, 0, backward - forward)
    sideVector.set(left - right, 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z })
    // // jumping
    // const world = rapier.world.raw()

    // const ray = world.castRay(new RAPIER.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 }))
    // const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
    if (jump) playerRef.current.setLinvel({ x: 0, y: 7.5, z: 0 })
  })

  return (
    <>
      <RigidBody
        ref={playerRef}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 10, 0]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
    </>
  )
}
