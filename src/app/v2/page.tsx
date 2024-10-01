import { ClientOnly } from "~/components/client-only"
import { NoQuarterWorld } from "./Map"

export default function Page() {
  return (
    <ClientOnly>
      <NoQuarterWorld />
    </ClientOnly>
  )
}
