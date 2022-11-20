const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verifyGatekeeperTwo")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  arguments = ["0x05982A7467b09A1999D9625d82F63cADfaD967f5"]

  const attacker = await deploy("GatekeepertwoAttacker", {
    from: deployer,
    log: true,
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

module.exports.tags = ["all", "gatekeepertwo"]
