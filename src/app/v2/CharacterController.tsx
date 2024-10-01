import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CapsuleCollider, type RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useControls } from "leva"
import { useEffect, useRef, useState } from "react"
import { type Group, MathUtils, type Object3D, type Object3DEventMap, Vector3 } from "three"
import { degToRad } from "three/src/math/MathUtils.js"
import { Character } from "./Character"

const normalizeAngle = (angle: number) => {
  let a = angle
  while (a > Math.PI) a -= 2 * Math.PI
  while (a < -Math.PI) a += 2 * Math.PI
  return a
}

const lerpAngle = (start: number, end: number, t: number) => {
  let s = normalizeAngle(start)
  let e = normalizeAngle(end)

  if (Math.abs(e - s) > Math.PI) {
    if (e > s) {
      s += 2 * Math.PI
    } else {
      e += 2 * Math.PI
    }
  }

  return normalizeAngle(start + (end - start) * t)
}

export const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls("Character Control", {
    WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0),
      max: degToRad(5),
      step: degToRad(0.1),
    },
  })
  const rb = useRef<RapierRigidBody>(null)
  const container = useRef<Group<Object3DEventMap>>(null)
  const character = useRef<Group<Object3DEventMap>>(null)

  const [animation, setAnimation] = useState("idle")

  const characterRotationTarget = useRef(0)
  const rotationTarget = useRef(0)
  const cameraTarget = useRef<Group<Object3DEventMap>>(null)
  const cameraPosition = useRef<Group<Object3DEventMap>>(null)
  const cameraWorldPosition = useRef(new Vector3())
  const cameraLookAtWorldPosition = useRef(new Vector3())
  const cameraLookAt = useRef(new Vector3())
  const [, get] = useKeyboardControls()
  const isClicking = useRef(false)

  useEffect(() => {
    const onMouseDown = () => {
      isClicking.current = true
    }
    const onMouseUp = () => {
      isClicking.current = false
    }
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
    // touch
    document.addEventListener("touchstart", onMouseDown)
    document.addEventListener("touchend", onMouseUp)
    return () => {
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("touchstart", onMouseDown)
      document.removeEventListener("touchend", onMouseUp)
    }
  }, [])

  useFrame(({ camera, mouse }) => {
    // const vel = rb.current.linvel()
    const vel = {
      x: 0,
      y: 0,
      z: 0,
    }
    const movement = {
      x: 0,
      z: 0,
    }
    if (get().forward) {
      movement.z = 1
    }
    if (get().backward) {
      movement.z = -1
    }
    let speed = get().run ? RUN_SPEED : WALK_SPEED
    if (isClicking.current) {
      console.log("clicking", mouse.x, mouse.y)
      if (Math.abs(mouse.x) > 0.1) {
        movement.x = -mouse.x
      }
      movement.z = mouse.y + 0.4
      if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
        speed = RUN_SPEED
      }
    }
    if (get().left) {
      movement.x = 1
    }
    if (get().right) {
      movement.x = -1
    }
    if (movement.x !== 0) {
      rotationTarget.current += ROTATION_SPEED * movement.x
    }
    if (movement.x !== 0 || movement.z !== 0) {
      characterRotationTarget.current = Math.atan2(movement.x, movement.z)
      vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed
      vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed
      if (speed === RUN_SPEED) {
        setAnimation("run")
      } else {
        setAnimation("walk")
      }
    } else {
      setAnimation("idle")
    }
    if (character.current) {
      character.current.rotation.y = lerpAngle(character.current?.rotation.y, characterRotationTarget.current, 0.1)
    }
    // rb.current.setLinvel(vel, true)

    // // CAMERA
    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(container.current.rotation.y, rotationTarget.current, 0.1)
    }
    if (cameraPosition.current) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current)
      camera.position.lerp(cameraWorldPosition.current, 0.1)
    }
    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current)
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1)
      camera.lookAt(cameraLookAt.current)
    }
  })

  return (
    <RigidBody
      colliders={false}
      lockRotations
      //  ref={rb}
    >
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={1} position-z={-2} />
        <group ref={character}>
          <Character scale={0.18} position-y={-0.25} animation={animation} />
        </group>
      </group>
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  )
}
