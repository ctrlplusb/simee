#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const readJson = require('load-json-file')

const configPath = path.resolve(process.cwd(), './.simeerc')

if (!fs.pathExistsSync(configPath)) {
  throw new Error('No .simeerc configuration file found')
}

const config = readJson.sync(configPath)

Object.keys(config).forEach(depName => {
  const relativeDir = config[depName]
  const sourcePath = path.resolve(process.cwd(), relativeDir)
  const targetPath = path.resolve(process.cwd(), `./node_modules/${depName}`)

  if (!fs.pathExistsSync(sourcePath)) {
    console.warn(
      `Could not find "${chalk.blue(depName)}" at "${chalk.green(
        targetPath,
      )}". Skipping.`,
    )
    return
  }
  if (fs.pathExistsSync(targetPath)) {
    fs.removeSync(targetPath)
  }

  console.log(
    `Linking "${chalk.blue(depName)}" to "${chalk.green(targetPath)}"`,
  )
  fs.ensureSymlinkSync(sourcePath, targetPath)

  const packageJsonPath = path.resolve(sourcePath, './package.json')
  if (fs.pathExistsSync(packageJsonPath)) {
    const packageJson = readJson.sync(packageJsonPath)
    if (packageJson.bin) {
      Object.keys(packageJson.bin).forEach(binaryName => {
        const binSourcePath = path.resolve(
          sourcePath,
          packageJson.bin[binaryName],
        )
        const binTargetPath = path.resolve(
          process.cwd(),
          `./node_modules/.bin/${binaryName}`,
        )
        console.log(
          `Linking binary "${chalk.blue(binaryName)}" to "${chalk.green(
            binTargetPath,
          )}"`,
        )
        fs.ensureSymlinkSync(binSourcePath, binTargetPath)
      })
    }
  }
})
