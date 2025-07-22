import fs from 'fs'
import path from 'path'

import archiver from 'archiver'
import { rimraf } from 'rimraf'

console.log(`Running in environment: ${process.env.NEXT_PUBLIC_ENV}`)
console.log(`Running in environment: ${process.env.NEXT_PUBLIC_API_V1}`)

// const baseURL = process.env.NEXT_PUBLIC_ENV === 'production' ? '.next-prod' : '.next-dev'
const baseURL = '.next'

// Determine the output directory based on environment
const outputDir = baseURL
const cacheDir = path.join(outputDir, 'cache', 'webpack')

// Function to delete Webpack cache
const deleteWebpackCache = () => {
  if (fs.existsSync(cacheDir)) {
    rimraf.sync(cacheDir)
    console.log(`Deleted Webpack cache from ${cacheDir}`)
  } else {
    console.log('No Webpack cache found to delete.')
  }
}

// Function to compress the output directory
const compressOutputDir = () => {
  const output = fs.createWriteStream(`${outputDir}.zip`)

  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  })

  output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`)
    console.log('Output directory has been compressed.')
  })

  archive.on('error', err => {
    throw err
  })

  archive.pipe(output)
  archive.directory(outputDir, path.basename(outputDir)) // Ensures .next is the root in the zip
  archive.finalize()
}

// Run the functions
deleteWebpackCache()
compressOutputDir()
