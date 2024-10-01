"use client"
import { Environment, KeyboardControls, OrthographicCamera, useAnimations, useGLTF } from "@react-three/drei"
import { Canvas, type PrimitiveProps } from "@react-three/fiber"
import { Physics, RigidBody } from "@react-three/rapier"
import { useControls } from "leva"
import { useEffect, useRef } from "react"
import { CharacterController } from "./CharacterController"

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
]

const maps: Record<string, { scale: number; position: [number, number, number] }> = {
  castle_on_hills: {
    scale: 3,
    position: [-6, -7, 0],
  },
  animal_crossing_map: {
    scale: 20,
    position: [-15, -1, 10],
  },
  city_scene_tokyo: {
    scale: 0.72,
    position: [0, -1, -3.5],
  },
  de_dust_2_with_real_light: {
    scale: 0.3,
    position: [-5, -3, 13],
  },
  medieval_fantasy_book: {
    scale: 0.4,
    position: [-4, 0, -6],
  },
}

export function NoQuarterWorld() {
  const { map } = useControls("Map", {
    map: {
      value: "animal_crossing_map",
      options: Object.keys(maps),
    },
  })
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        style={{ touchAction: "none", height: "100vh", width: "100vw" }}
        shadows
        camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
      >
        <Environment preset="sunset" />
        <directionalLight
          intensity={0.65}
          castShadow
          position={[-15, 10, 15]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.00005}
        >
          <OrthographicCamera left={-22} right={15} top={10} bottom={-20} attach={"shadow-camera"} />
        </directionalLight>
        <Physics key={map}>
          <CustomMap scale={maps[map].scale} position={maps[map].position} model={`models/${map}.glb`} />
          <CharacterController />
        </Physics>
      </Canvas>
    </KeyboardControls>
  )
}

function CustomMap({ model, ...props }: Omit<PrimitiveProps, "object"> & { model: string }) {
  const { scene, animations } = useGLTF(model)
  const group = useRef()
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    scene.traverse((child) => {
      // @ts-ignore
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0]?.name]?.play()
    }
  }, [actions, animations.length, animations[0]?.name])

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} {...props} ref={group} />
      </RigidBody>
    </group>
  )
}
