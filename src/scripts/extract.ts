import * as fs from "node:fs"
import * as path from "node:path"

interface CombinedData {
  user: string
  type: string
  ts: string
  client_msg_id: string
  text: string
  user_profile: {
    display_name: string
  }
}

function extractMessages(inputFile: string, outputFiles: { [key: string]: string }) {
  try {
    // Read and parse the combined JSON file
    const rawData = fs.readFileSync(inputFile, "utf8")
    const combinedData = JSON.parse(rawData) as CombinedData[]

    // Create write streams for each output file
    const writeStreams = Object.entries(outputFiles).reduce(
      (acc, [name, file]) => {
        acc[name] = fs.createWriteStream(file)
        return acc
      },
      {} as { [key: string]: fs.WriteStream },
    )

    // Process each message and write to appropriate file
    for (const entry of combinedData) {
      if (!entry.text || !entry.user_profile) continue
      const name = entry.user_profile.display_name.toLowerCase()
      if (writeStreams[name]) {
        writeStreams[name].write(`${entry.text}\n`)
      }
    }

    // Close all write streams
    Object.values(writeStreams).forEach((stream) => stream.end())
    console.log("Successfully created message files for Jack, George, and Dan")
  } catch (error) {
    console.error("Error processing files:", error)
  }
}

// Execute the script
const inputFile = path.join(process.cwd(), "data", "combined.json")
const outputFiles = {
  jack: path.join(process.cwd(), "data", "jack-messages.txt"),
  george: path.join(process.cwd(), "data", "george-messages.txt"),
  dan: path.join(process.cwd(), "data", "dan-messages.txt"),
}

extractMessages(inputFile, outputFiles)
