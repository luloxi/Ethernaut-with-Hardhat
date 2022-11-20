const { deployments, ethers } = require("hardhat")

async function main() {
  /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  console.log("Attacker sends some value on deployment and rejects receiving any value")
  await deployments.fixture("king")

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
