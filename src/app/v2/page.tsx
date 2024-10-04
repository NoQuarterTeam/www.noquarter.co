import { ClientOnly } from "~/components/client-only"
import { NoQuarterWorld } from "./Map"

export default function Page() {
  return (
    <div className="dark h-screen w-screen bg-black">
      <ClientOnly>
        <NoQuarterWorld />
      </ClientOnly>
    </div>
  )
}
