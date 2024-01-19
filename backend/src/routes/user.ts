import express from "express";
import { UserModel } from "../models/User";
import { CommunityModel } from "../models/Community";

const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
	const user = await UserModel.findById(req.params.id).select('+experiencePoints');
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
	const users = await UserModel.aggregate([
		{
			$unwind: "$experiencePoints"
		},
		{
			$group: {
				_id: "$_id",
				email: { $first: "$email" },
				profilePicture: { $first: "$profilePicture" },
				totalExperience: { $sum: "$experiencePoints.points" }
			}
		}
	]);
	res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;

	const user = await UserModel.findById(userId);
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	const community = await CommunityModel.findById(communityId);
	if (!community) {
		return res.status(404).send({ message: "Community not found" });
	}

	if (user.currentCommunity && user.currentCommunity._id.toString() === community._id.toString()) {
		return res.status(400).send({ message: "User already in this community" });
	}

	try {
		user.currentCommunity = community;
		await user.save();
	} catch(e) {
		return res.status(500).send({ message: "Error saving user" });
	}

	res.json({ message: "User joined community." });
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;

	const user = await UserModel.findById(userId);
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	const community = await CommunityModel.findById(communityId);

	if (!community) {
		return res.status(404).send({ message: "Community not found" });
	}

	// Check if user is in the community they are attempting to leave
	if (!user.currentCommunity || user.currentCommunity._id.toString() !== community._id.toString()) {
		return res.status(400).send({ message: "User not in this community" });
	}

	try {
		user.currentCommunity = null;
		await user.save();
	}catch(e) {
		return res.status(500).send({ message: "Error saving user" });
	}

	res.json({ message: "User left community." });
});

export {
    userRouter
}
