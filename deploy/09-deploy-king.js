const { ethers } = require("ethers")
const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  arguments = ["0x094E246Be252E1EBD73F6baD18aaf91E0A2821f1"]

  const attacker = await deploy("KingAttacker", {
    from: deployer,
    log: true,
    value: ethers.utils.parseEther("0.002"),
    args: arguments,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  log("-------------------------------------")

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(attacker.address, arguments)
  }

  log("-------------------------------------")
}

module.exports.tags = ["all", "king"]
