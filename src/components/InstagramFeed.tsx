import Script from "next/script"

export function InstagramFeed({ instagramEmbedId }: { instagramEmbedId: string }) {
  return (
    <>
      <figure data-behold-id={instagramEmbedId} />
      <Script src="https://w.behold.so/widget.js" />
    </>
  )
}
