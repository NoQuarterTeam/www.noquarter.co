function getSettings(settings = {}) {
  return { max: 1, reverse: false, ...settings }
}

const TRANSITION_MS = 300

export function tilt(node: any, settingsObj?: Record<string, any>) {
  const { width, height, left, top } = node.getBoundingClientRect()
  let settings = getSettings(settingsObj)
  let reverse = settings.reverse ? -1 : 1

  function onMouseMove(e: any) {
    const percX = (e.clientX - left) / width
    const percY = (e.clientY - top) / height

    const { max } = settings
    const twiceMax = max * 2
    const tiltX = max - percX * twiceMax
    const tiltY = percY * twiceMax - max

    node.style.transform =
      `translateZ(${50}px) ` +
      `perspective(${1000}px) ` +
      `rotateX(${reverse * tiltY}deg) ` +
      `rotateY(${reverse * tiltX}deg)`
  }

  let transitionId: NodeJS.Timeout
  function smoothTransition() {
    clearTimeout(transitionId)
    node.style.willChange = "transform"
    node.style.transition = `${TRANSITION_MS}ms`
    transitionId = setTimeout(() => (node.style.transition = "0s"), TRANSITION_MS)
  }

  function onMouseLeave() {
    smoothTransition()
    node.style.transform = `translateZ(0px) ` + `perspective(${1000}px) ` + `rotateX(0deg) ` + `rotateY(0deg)`
  }

  function onMouseEnter() {
    smoothTransition()
    node.style.willChange = "transform"
  }

  node.addEventListener("mousemove", onMouseMove)
  node.addEventListener("mouseleave", onMouseLeave)
  node.addEventListener("mouseenter", onMouseEnter)

  return {
    destroy() {
      node.removeEventListener("mousemove", onMouseMove)
      node.removeEventListener("mouseleave", onMouseLeave)
      node.removeEventListener("mouseleave", onMouseEnter)
    },
    update(settingsObj: Record<string, any>) {
      settings = getSettings(settingsObj)
      reverse = settings.reverse ? -1 : 1
    },
  }
}
