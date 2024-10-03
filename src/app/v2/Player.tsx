"use client"
import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CapsuleCollider, type RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useRef } from "react"
import * as THREE from "three"

const SPEED = 5
const ROTATION_SPEED = 0.05
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export function Player() {
  const playerRef = useRef<RapierRigidBody>(null)
  const [_, get] = useKeyboardControls()

  useFrame((state) => {
    const { forward, backward, left, right, jump, rotateLeft, rotateRight } = get()

    if (!playerRef.current) return

    const velocity = playerRef.current.linvel()

    // update camera
    const position = playerRef.current.translation()
    state.camera.position.set(position.x, position.y, position.z)

    // rotation
    if (rotateLeft) {
      state.camera.rotation.y += ROTATION_SPEED
    }
    if (rotateRight) {
      state.camera.rotation.y -= ROTATION_SPEED
    }

    // movement
    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
    // @ts-ignore
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z })

    // jumping
    // @ts-ignore
    if (jump) playerRef.current.setLinvel({ x: velocity.x, y: 7.5, z: velocity.z })
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
