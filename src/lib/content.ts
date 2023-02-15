export type Content = {
  title: string
  description: string | undefined
  tags: string[]
  images: string[] | undefined
  meta: string
  link: string | undefined
  isLikeable: boolean
}
export const CONTENT: Content[] = [
  {
    title: "About us",
    images: undefined,
    description:
      "Come get lit with the boys, Reprehenderit magna veniam sint incididunt. Eu laboris enim nulla aliqua.",
    tags: ["About"],
    meta: "about us why how when where",
    link: "/about",
    isLikeable: true,
  },
  {
    title: "Team",
    images: undefined,
    description:
      "We are the boys and we do cool things, Sint Lorem ea velit dolore magna laboris officia irure laboris esse eiusmod aute sit minim.",
    tags: ["About"],
    meta: "about the team why how when where who are we",
    link: "/team",
    isLikeable: true,
  },
  {
    title: "Warehouse",
    images: undefined,
    description:
      "This is where we work, and its cool and has things to do in it. Nostrud excepteur qui est et cupidatat laboris duis cupidatat aliqua.",
    tags: ["About"],
    meta: "warehouse office space co working",
    link: "/warehouse",
    isLikeable: true,
  },
  {
    title: "Amplify",
    images: undefined,
    description: "Laboris officia eu fugiat eiusmod non commodo eu sunt eu. Non esse sit excepteur.",
    tags: ["Projects"],
    meta: "amplify trendwatching web app platform innovations trends react",
    link: "/amplify",
    isLikeable: true,
  },
  {
    title: "Noa",
    images: undefined,
    description: "Noa is a bike thing with bikes in a load of cool places and companies that use them.",
    tags: ["Projects"],
    meta: "noa web app platform bikes iot react native mobile",
    link: "/noa",
    isLikeable: true,
  },
  {
    title: "Notion",
    images: undefined,
    description:
      "Notion is a tool we use for everuthing, its a good thing it helps with doing stuff and thats cool.",
    tags: ["Inspiration"],
    link: undefined,
    meta: "notion inspiration motivation quotes ideas",
    isLikeable: true,
  },
  {
    title: "Scrambler",
    images: ["scrambler1.jpeg"],
    description: "This is an electric bike that can be used to go from places to places.",
    tags: ["Internals"],
    meta: "scrambler electric bike iot sustainability",
    link: "/scrambler",
    isLikeable: true,
  },
]
