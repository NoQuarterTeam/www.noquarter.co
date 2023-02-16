export type Content = {
  title: string
  description: string | undefined
  tags: string[]
  image: string | undefined
  meta: string
  link: string | undefined
  isLikeable: boolean
}
export const CONTENT: Content[] = [
  {
    title: "About us",
    image: undefined,
    description:
      "Come get lit with the boys, Reprehenderit magna veniam sint incididunt. Eu laboris enim nulla aliqua.",
    tags: ["About"],
    meta: "about us why how when where",
    link: "/about",
    isLikeable: true,
  },
  {
    title: "Team",
    image: undefined,
    description:
      "We are the boys and we do cool things, Sint Lorem ea velit dolore magna laboris officia irure laboris esse eiusmod aute sit minim.",
    tags: ["About"],
    meta: "about the team why how when where who are we",
    link: "/team",
    isLikeable: true,
  },
  {
    title: "Amplify",
    image: undefined,
    description: "Laboris officia eu fugiat eiusmod non commodo eu sunt eu. Non esse sit excepteur.",
    tags: ["Projects"],
    meta: "latest projects amplify trendwatching web app platform innovations trends react",
    link: "/amplify",
    isLikeable: true,
  },
  {
    title: "Noa",
    image: undefined,
    description: "Noa is a bike thing with bikes in a load of cool places and companies that use them.",
    tags: ["Projects"],
    meta: "latest projects noa web platform bikes iot react native mobile ios app android app",
    link: "/noa",
    isLikeable: true,
  },
  {
    title: "Warehouse",
    image: "warehouse1.webp",
    description:
      "This is where we work, and its cool and has things to do in it. Nostrud excepteur qui est et cupidatat laboris duis cupidatat aliqua.",
    tags: ["About"],
    meta: "warehouse office space co working event events",
    link: "/warehouse",
    isLikeable: true,
  },
  {
    title: "Notion",
    image: undefined,
    description:
      "Notion is a tool we use for everuthing, its a good thing it helps with doing stuff and thats cool.",
    tags: ["Inspiration"],
    link: undefined,
    meta: "notion inspiration motivation quotes ideas",
    isLikeable: true,
  },
  {
    title: "Scrambler",
    image: "scrambler1.webp",
    description: "This is an electric bike that can be used to go from places to places.",
    tags: ["Internals"],
    meta: "latest projects scrambler electric bike iot sustainability",
    link: "/scrambler",
    isLikeable: true,
  },
  {
    title: "NTS",
    image: undefined,
    description: "NTS is a radio show that powers us, providing us with delicious beats daily.",
    tags: ["Inspiration"],
    link: undefined,
    meta: "nts music power techno electro ideas",
    isLikeable: true,
  },
]
