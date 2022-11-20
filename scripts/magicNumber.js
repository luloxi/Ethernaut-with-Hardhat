const { ethers } = require("hardhat")

const magicNumberInstanceAddress = "0x66b8C9608bE926b899236829Abfb2Ca36766eD85"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Get MagicNumber contract */

  console.log("Connecting to your instance of Magic Number contract...")
  const magicNumber = await ethers.getContractAt("MagicNum", magicNumberInstanceAddress, deployer)

  console.log("Creating contract by sending bytecode to 0x0 address...")
  const tx = {
    from: deployer.address,
    data: "0x600a600c600039600a6000f3602a60505260206050f3",
  }
  const contractCreation = await deployer.sendTransaction(tx)
  const solverAddress = contractCreation["creates"]

  // Inspecting contractCreation properties to get the created contract address
  // for (let property in contractCreation) {
  //   console.log("Property " + property + " = " + contractCreation[property])
  // }

  /* Running the attack */

  console.log("Setting bytecode contract as solver...")
  const solving = await magicNumber.setSolver(solverAddress)
  await solving.wait(1)
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
