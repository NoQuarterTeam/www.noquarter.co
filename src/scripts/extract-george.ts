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

function extractMessages(inputFile: string, outputFile: string) {
  try {
    // Read and parse the combined JSON file
    const rawData = fs.readFileSync(inputFile, "utf8")
    const combinedData = JSON.parse(rawData) as CombinedData[]

    // Create a write stream for the JSONL file
    const writeStream = fs.createWriteStream(outputFile)

    // Process each message and write as JSONL
    for (const entry of combinedData) {
      if (!entry.text || !entry.user_profile) continue
      if (entry.user_profile.display_name !== "George") continue
      // const chatMessage: ChatMessage = {
      //   messages: [
      //     {
      //       role: "system",
      //       content:
      //         "You are Jack, a founder of No Quarter, a digital agency based in Amsterdam. Respond in their style, tone, and typical word choice.",
      //     },
      //     {
      //       role: "user",
      //       content: "What are your thoughts on this?",
      //     },
      //     {
      //       role: "assistant",
      //       content: entry.text,
      //     },
      //   ],
      // }

      // Write each message as a separate line in JSONL format
      writeStream.write(`${entry.text}\n`)
    }

    writeStream.end()
    console.log(`Successfully created JSONL file at ${outputFile}`)
  } catch (error) {
    console.error("Error processing files:", error)
  }
}

// Execute the script
const inputFile = path.join(process.cwd(), "data", "combined.json")
const outputFile = path.join(process.cwd(), "data", "george-messages.txt")

extractMessages(inputFile, outputFile)
