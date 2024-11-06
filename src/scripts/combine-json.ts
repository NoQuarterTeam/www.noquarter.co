import * as fs from "node:fs"
import * as path from "node:path"

// Function to read and parse JSON file
function readJsonFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}

// Function to recursively get all JSON files in a directory
function getJsonFiles(dir: string): string[] {
  let results: string[] = []
  const list = fs.readdirSync(dir)

  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results = results.concat(getJsonFiles(filePath))
    } else if (file.endsWith(".json")) {
      results.push(filePath)
    }
  }

  return results
}

// Main function to combine JSON files
function combineJsonFiles(sourceDir: string, outputFile: string) {
  // Get all JSON files in the directory and its subdirectories
  const jsonFiles = getJsonFiles(sourceDir)

  // Array to hold all JSON content
  const combinedContent: any[] = []

  // Process each JSON file
  for (const filePath of jsonFiles) {
    const content = readJsonFile(filePath)
    if (!content) continue

    // If content is an array, spread it
    if (Array.isArray(content)) {
      combinedContent.push(...content)
    } else {
      // If content is an object, push it as is
      combinedContent.push(content)
    }
  }

  // Write combined content to output file
  try {
    fs.writeFileSync(outputFile, JSON.stringify(combinedContent, null, 2))
    console.log(`Successfully combined ${jsonFiles.length} files into ${outputFile}`)
  } catch (error) {
    console.error("Error writing output file:", error)
  }
}

// Execute the script
const sourceDirectory = path.join(process.cwd(), "data")
const outputFile = path.join(process.cwd(), "data", "combined.json")

combineJsonFiles(sourceDirectory, outputFile)
