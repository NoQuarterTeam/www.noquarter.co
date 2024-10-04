import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CapsuleCollider, type RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useRef } from "react"
import * as THREE from "three"

const SPEED = 8
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export function Player() {
  const playerRef = useRef<RapierRigidBody>(null)
  const [_, get] = useKeyboardControls()

  useFrame((state) => {
    const { forward, backward, left, right, jump } = get()

    if (!playerRef.current) return

    const velocity = playerRef.current.linvel()

    // movement
    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED)
    direction.applyQuaternion(state.camera.quaternion)
    direction.y = 0 // Ensure movement is always on the same plane

    // @ts-ignore
    playerRef.current.setLinvel({ x: direction.x, y: jump ? 10 : velocity.y, z: direction.z })
  })

  return (
    <RigidBody
      ref={playerRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 10, 0]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[1, 1]} />
      <mesh>
        <capsuleGeometry args={[1, 1, 4, 10]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  )
}
