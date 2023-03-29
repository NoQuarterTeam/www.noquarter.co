import "../global.css"

export const metadata = {
  title: {
    default: "No Quarter",
    template: "%s | No Quarter",
  },
  colorScheme: "dark",
  themeColor: "black",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="No Quarter agency" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative mb-52 min-h-screen bg-neutral-900 p-4 md:p-10">{children}</body>
    </html>
  )
}
