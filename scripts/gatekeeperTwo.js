const { deployments, ethers } = require("hardhat")

async function main() {
  // /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  await deployments.fixture("gatekeepertwo")

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
