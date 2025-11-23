import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SimpleSavingPlan", function () {
  // Constants from the contract
  const GRACE_PERIOD = 2 * 24 * 60 * 60; // 2 days in seconds
  const REWARD_PERCENTAGE_BPS = 2000; // 20% in basis points

  async function deployFixture() {
    const [owner, user1, user2, user3] = await hre.ethers.getSigners();

    // Deploy a mock ERC20 token for testing
    const MockERC20Factory = await hre.ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy(
      "Test Token",
      "TEST",
      hre.ethers.parseEther("1000000") // 1M tokens total supply
    );

    // Deploy SimpleSavingPlan contract
    const SimpleSavingPlanFactory = await hre.ethers.getContractFactory("SimpleSavingPlan");
    const simpleSavingPlan = await SimpleSavingPlanFactory.deploy();

    // Give tokens to users
    await mockToken.transfer(user1.address, hre.ethers.parseEther("10000"));
    await mockToken.transfer(user2.address, hre.ethers.parseEther("10000"));
    await mockToken.transfer(user3.address, hre.ethers.parseEther("10000"));

    return {
      simpleSavingPlan,
      mockToken,
      owner,
      user1,
      user2,
      user3,
    };
  }

  async function createPlanFixture() {
    const fixture = await loadFixture(deployFixture);
    const { simpleSavingPlan, mockToken, user1 } = fixture;

    const dailyAmount = hre.ethers.parseEther("10"); // 10 tokens per day
    const totalDays = 30n; // 30 days
    const penaltyStake = hre.ethers.parseEther("100"); // 100 tokens stake

    // Approve tokens for plan creation
    await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), penaltyStake);

    // Create the plan
    await simpleSavingPlan.connect(user1).createPlan(
      await mockToken.getAddress(),
      dailyAmount,
      totalDays,
      penaltyStake,
    );

    return {
      ...fixture,
      planId: 1n,
      dailyAmount,
      totalDays,
      penaltyStake,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { simpleSavingPlan, owner } = await loadFixture(deployFixture);
      expect(await simpleSavingPlan.owner()).to.equal(owner.address);
    });

    it("Should initialize planCounter to 0", async function () {
      const { simpleSavingPlan } = await loadFixture(deployFixture);
      expect(await simpleSavingPlan.planCounter()).to.equal(0n);
    });

    it("Should have correct constants", async function () {
      const { simpleSavingPlan } = await loadFixture(deployFixture);
      expect(await simpleSavingPlan.GRACE_PERIOD()).to.equal(BigInt(GRACE_PERIOD));
      expect(await simpleSavingPlan.REWARD_PERCENTAGE()).to.equal(20n);
      expect(await simpleSavingPlan.REWARD_PERCENTAGE_BPS()).to.equal(BigInt(REWARD_PERCENTAGE_BPS));
    });
  });

  describe("Plan Creation", function () {
    it("Should create a plan successfully", async function () {
      const {
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(deployFixture);

      const dailyAmount = hre.ethers.parseEther("10");
      const totalDays = 30n;
      const penaltyStake = hre.ethers.parseEther("100");

      // Approve tokens
      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), penaltyStake);

      // Create plan
      await simpleSavingPlan.connect(user1).createPlan(
        await mockToken.getAddress(),
        dailyAmount,
        totalDays,
        penaltyStake,
      );

      // Check plan details
      const plan = await simpleSavingPlan.getPlan(1n);
      expect(plan.user).to.equal(user1.address);
      expect(plan.token).to.equal(await mockToken.getAddress());
      expect(plan.dailyAmount).to.equal(dailyAmount);
      expect(plan.totalDays).to.equal(totalDays);
      expect(plan.penaltyStake).to.equal(penaltyStake);
      expect(plan.currentDay).to.equal(0n);
      expect(plan.isActive).to.equal(true);
      expect(plan.isCompleted).to.equal(false);
      expect(plan.isFailed).to.equal(false);
      expect(plan.startTime).to.equal(0n);

      // Check planCounter incremented
      expect(await simpleSavingPlan.planCounter()).to.equal(1n);

      // Check penalty stake was transferred
      expect(await mockToken.balanceOf(await simpleSavingPlan.getAddress())).to.equal(penaltyStake);
    });

    it("Should emit PlanCreated event", async function () {
      const {
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(deployFixture);

      const dailyAmount = hre.ethers.parseEther("10");
      const totalDays = 30n;
      const penaltyStake = hre.ethers.parseEther("100");

      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), penaltyStake);

      await expect(
        simpleSavingPlan.connect(user1).createPlan(
          await mockToken.getAddress(),
          dailyAmount,
          totalDays,
          penaltyStake,
        )
      ).to.emit(simpleSavingPlan, "PlanCreated")
       .withArgs(1n, user1.address, await mockToken.getAddress(), dailyAmount, totalDays, penaltyStake);
    });

    it("Should revert with invalid parameters", async function () {
      const {
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(deployFixture);

      // Test totalDays = 0
      await expect(
        simpleSavingPlan.connect(user1).createPlan(
          await mockToken.getAddress(),
          hre.ethers.parseEther("10"),
          0n,
          hre.ethers.parseEther("100"),
        )
      ).to.be.revertedWith("totalDays>0");

      // Test dailyAmount = 0
      await expect(
        simpleSavingPlan.connect(user1).createPlan(
          await mockToken.getAddress(),
          0n,
          30n,
          hre.ethers.parseEther("100"),
        )
      ).to.be.revertedWith("dailyAmount>0");

      // Test penaltyStake = 0
      await expect(
        simpleSavingPlan.connect(user1).createPlan(
          await mockToken.getAddress(),
          hre.ethers.parseEther("10"),
          30n,
          0n,
        )
      ).to.be.revertedWith("penaltyStake>0");

      // Test invalid token address
      await expect(
        simpleSavingPlan.connect(user1).createPlan(
          hre.ethers.ZeroAddress,
          hre.ethers.parseEther("10"),
          30n,
          hre.ethers.parseEther("100"),
        )
      ).to.be.revertedWith("invalid-token");
    });

    it("Should revert if insufficient allowance", async function () {
      const {
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(deployFixture);

      // Don't approve tokens
      await expect(
        simpleSavingPlan.connect(user1).createPlan(
          await mockToken.getAddress(),
          hre.ethers.parseEther("10"),
          30n,
          hre.ethers.parseEther("100"),
        )
      ).to.be.reverted;
    });
  });

  describe("Daily Payments", function () {
    it("Should accept first payment and set start time", async function () {
      const {
        planId,
        dailyAmount,
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(createPlanFixture);

      // Approve tokens for daily payment
      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), dailyAmount);

      const paymentTime = await time.latest();
      await simpleSavingPlan.connect(user1).payDaily(planId);

      // Check plan updated
      const plan = await simpleSavingPlan.getPlan(planId);
      expect(plan.currentDay).to.equal(1n);
      expect(plan.startTime).to.be.greaterThan(BigInt(paymentTime));
      expect(plan.lastPaidAt).to.be.greaterThan(BigInt(paymentTime));

      // Check tokens transferred
      expect(await mockToken.balanceOf(await simpleSavingPlan.getAddress())).to.equal(
        dailyAmount + plan.penaltyStake
      );
    });

    it("Should emit DailyPaid event", async function () {
      const {
        planId,
        dailyAmount,
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(createPlanFixture);

      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), dailyAmount);

      await expect(
        simpleSavingPlan.connect(user1).payDaily(planId)
      ).to.emit(simpleSavingPlan, "DailyPaid")
       .withArgs(planId, user1.address, 1n);
    });

    it("Should complete plan after all payments", async function () {
      const {
        planId,
        dailyAmount,
        totalDays,
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(createPlanFixture);

      // Make all required payments
      for (let i = 0; i < Number(totalDays); i++) {
        await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), dailyAmount);
        await simpleSavingPlan.connect(user1).payDaily(planId);
      }

      // Check plan completed
      const plan = await simpleSavingPlan.getPlan(planId);
      expect(plan.isCompleted).to.equal(true);
      expect(plan.isActive).to.equal(false);
      expect(plan.currentDay).to.equal(totalDays);
    });

    it("Should revert if not plan owner", async function () {
      const {
        planId,
        dailyAmount,
        simpleSavingPlan,
        mockToken,
        user2,
      } = await loadFixture(createPlanFixture);

      // Try to pay from different user
      await mockToken.connect(user2).approve(await simpleSavingPlan.getAddress(), dailyAmount);

      await expect(
        simpleSavingPlan.connect(user2).payDaily(planId)
      ).to.be.revertedWith("not-plan-owner");
    });
  });

  describe("Penalty System", function () {
    it("Should allow grace period for first missed payment", async function () {
      const {
        planId,
        dailyAmount,
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(createPlanFixture);

      // Make first payment
      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), dailyAmount);
      await simpleSavingPlan.connect(user1).payDaily(planId);

      // Fast forward 1 day (within grace period)
      await time.increase(24 * 60 * 60);

      // Check penalty - should not deduct yet
      await simpleSavingPlan.connect(user1).checkAndDeductPenalty(planId);

      const plan = await simpleSavingPlan.getPlan(planId);
      expect(plan.penaltyStake).to.equal(hre.ethers.parseEther("100")); // No penalty deducted
      expect(plan.firstMissTime).to.be.greaterThan(0n); // Grace period started
    });

    it("Should deduct penalty after grace period expires", async function () {
      const {
        planId,
        dailyAmount,
        penaltyStake,
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(createPlanFixture);

      // Make first payment
      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), dailyAmount);
      await simpleSavingPlan.connect(user1).payDaily(planId);

      // Fast forward 1 day first (to trigger the missed payment)
      await time.increase(24 * 60 * 60 + 1); // 1 day + 1 second

      // Call checkAndDeductPenalty first time to set firstMissTime
      await simpleSavingPlan.connect(user1).checkAndDeductPenalty(planId);

      // Now fast forward beyond grace period
      await time.increase(GRACE_PERIOD + 24 * 60 * 60); // Grace period + 1 day

      // Check and deduct penalty again
      await simpleSavingPlan.connect(user1).checkAndDeductPenalty(planId);

      const plan = await simpleSavingPlan.getPlan(planId);
      
      // Check that grace period has been used
      expect(plan.hasUsedGracePeriod).to.equal(true);

      // Check that firstMissTime was set
      expect(plan.firstMissTime).to.be.greaterThan(0n);

      // Check reward pool increased (any penalty should contribute to reward pool)
      const rewardPoolBalance = await simpleSavingPlan.getRewardPoolBalance(
        await mockToken.getAddress()
      );
      expect(rewardPoolBalance).to.be.greaterThan(0n);
    });

    it("Should mark plan failed manually after grace period", async function () {
      const {
        planId,
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(createPlanFixture);

      // Make first payment
      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), hre.ethers.parseEther("10"));
      await simpleSavingPlan.connect(user1).payDaily(planId);

      // Fast forward beyond grace period
      await time.increase(GRACE_PERIOD + 24 * 60 * 60);

      // Mark as failed
      await expect(
        simpleSavingPlan.connect(user1).markFailed(planId)
      ).to.emit(simpleSavingPlan, "PlanFailed")
       .withArgs(planId);

      const plan = await simpleSavingPlan.getPlan(planId);
      expect(plan.isFailed).to.equal(true);
      expect(plan.isActive).to.equal(false);
      expect(plan.penaltyStake).to.equal(0n); // Stake sent to reward pool
    });
  });

  describe("Withdrawal and Rewards", function () {
    it("Should allow withdrawal after plan completion", async function () {
      const {
        planId,
        dailyAmount,
        totalDays,
        penaltyStake,
        simpleSavingPlan,
        mockToken,
        user1,
        owner,
      } = await loadFixture(createPlanFixture);

      // Calculate expected bonus and fund the contract
      const savedAmount = dailyAmount * totalDays;
      const rewardBonus = (savedAmount * BigInt(REWARD_PERCENTAGE_BPS)) / 10000n;
      
      // Fund the contract with the bonus amount (owner deposits for rewards)
      await mockToken.transfer(await simpleSavingPlan.getAddress(), rewardBonus);

      // Complete the plan
      for (let i = 0; i < Number(totalDays); i++) {
        await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), dailyAmount);
        await simpleSavingPlan.connect(user1).payDaily(planId);
      }

      // Get initial balance
      const initialBalance = await mockToken.balanceOf(user1.address);

      // Withdraw
      await simpleSavingPlan.connect(user1).withdraw(planId);

      // Check final balance
      const finalBalance = await mockToken.balanceOf(user1.address);
      
      // Calculate expected amounts (no reward pool share for single user)
      const expectedWithdrawal = savedAmount + rewardBonus + penaltyStake;

      expect(finalBalance - initialBalance).to.equal(expectedWithdrawal);
    });

    it("Should revert withdrawal if not plan owner", async function () {
      const {
        planId,
        dailyAmount,
        totalDays,
        simpleSavingPlan,
        mockToken,
        user1,
        user2,
      } = await loadFixture(createPlanFixture);

      // Complete the plan
      for (let i = 0; i < Number(totalDays); i++) {
        await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), dailyAmount);
        await simpleSavingPlan.connect(user1).payDaily(planId);
      }

      // Try to withdraw as different user
      await expect(
        simpleSavingPlan.connect(user2).withdraw(planId)
      ).to.be.revertedWith("not-plan-owner");
    });

    it("Should revert withdrawal if plan not completed", async function () {
      const {
        planId,
        dailyAmount,
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(createPlanFixture);

      // Make only one payment
      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), dailyAmount);
      await simpleSavingPlan.connect(user1).payDaily(planId);

      // Try to withdraw
      await expect(
        simpleSavingPlan.connect(user1).withdraw(planId)
      ).to.be.revertedWith("plan-not-completed");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to emergency withdraw reward pool", async function () {
      const {
        simpleSavingPlan,
        mockToken,
        owner,
        user1,
      } = await loadFixture(deployFixture);

      // Create some reward pool funds
      const penaltyStake = hre.ethers.parseEther("100");
      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), penaltyStake);

      await simpleSavingPlan.connect(user1).createPlan(
        await mockToken.getAddress(),
        hre.ethers.parseEther("10"),
        5n,
        penaltyStake,
      );

      // Make payment and fail the plan to create reward pool
      await mockToken.connect(user1).approve(await simpleSavingPlan.getAddress(), hre.ethers.parseEther("10"));
      await simpleSavingPlan.connect(user1).payDaily(1n);
      await time.increase(GRACE_PERIOD + 24 * 60 * 60);
      await simpleSavingPlan.connect(user1).markFailed(1n);

      // Check reward pool has funds
      const rewardPoolBalance = await simpleSavingPlan.getRewardPoolBalance(
        await mockToken.getAddress()
      );
      expect(rewardPoolBalance).to.be.greaterThan(0n);

      // Emergency withdraw as owner
      const initialOwnerBalance = await mockToken.balanceOf(owner.address);
      await simpleSavingPlan.emergencyWithdrawRewardPool(
        await mockToken.getAddress(),
        owner.address,
      );

      const finalOwnerBalance = await mockToken.balanceOf(owner.address);
      expect(finalOwnerBalance - initialOwnerBalance).to.equal(rewardPoolBalance);
    });

    it("Should revert emergency withdraw if not owner", async function () {
      const {
        simpleSavingPlan,
        mockToken,
        user1,
      } = await loadFixture(deployFixture);

      await expect(
        simpleSavingPlan.connect(user1).emergencyWithdrawRewardPool(
          await mockToken.getAddress(),
          user1.address,
        )
      ).to.be.reverted;
    });
  });
});