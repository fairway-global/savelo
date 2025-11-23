import hre from "hardhat";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  console.log("🚀 Deploying SimpleSavingPlan contract to Celo...\n");

  // Debug: Check if PRIVATE_KEY is loaded
  console.log("🔍 Checking environment variables...");
  console.log("PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
  console.log("PRIVATE_KEY length:", process.env.PRIVATE_KEY?.length || 0);
  
  // Get wallet clients - will use first account from hardhat config
  const walletClients = await hre.viem.getWalletClients();
  console.log("walletClients count:", walletClients?.length || 0);
  
  if (!walletClients || walletClients.length === 0) {
    console.error("❌ Error: No wallet clients found.");
    console.error("Make sure PRIVATE_KEY is set in your .env file.");
    process.exit(1);
  }

  const deployer = walletClients[0];
  const deployerAddress = deployer.account.address;
  console.log("📝 Deploying with account:", deployerAddress);
  
  try {
    const publicClient = await hre.viem.getPublicClient();
    const balance = await publicClient.getBalance({ address: deployerAddress });
    const balanceInCELO = Number(balance) / 1e18;
    console.log(`💰 Account balance: ${balanceInCELO.toFixed(4)} CELO\n`);
    
    if (balance === 0n) {
      console.error("❌ Error: Account has no balance. Please fund your account first.");
      console.log("Get testnet tokens from: https://faucet.celo.org");
      process.exit(1);
    }
  } catch (error) {
    console.log("⚠️  Could not check balance, continuing with deployment...\n");
  }

  // Deploy the contract - deployContract will use the first account automatically
  console.log("📦 Deploying contract...");
  const SimpleSavingPlan = await hre.viem.deployContract("SimpleSavingPlan", []);

  const address = SimpleSavingPlan.address;
  console.log("\n✅ Deployment successful!");
  console.log("📍 Contract address:", address);
  console.log("\n🔍 Verify on Celoscan:");
  console.log(`   https://celoscan.io/address/${address}`);
  console.log("\n📋 Update your apps/web/.env.local with:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

