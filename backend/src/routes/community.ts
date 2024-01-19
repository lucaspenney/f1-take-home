import express from "express";
import { CommunityModel } from "../models/Community";

const communityRouter = express.Router();

/**
 * @route GET /community/leaderboard
 * @returns {Array<Community>} - Array of Community objects
 */
communityRouter.get("/leaderboard", async (req, res) => {
	try {
		const leaderboard = await CommunityModel.aggregate([
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "currentCommunity",
					as: "users"
				}
			},
			{
				$project: {
					name: 1,
					logo: 1,
					users: 1,
					totalExperience: {
						$sum: {
							$map: {
								input: "$users",
								as: "user",
								in: { $sum: "$$user.experiencePoints.points" }
							}
						}
					},
					totalUsers: { $size: "$users" }
				}
			},
			{
				$sort: { totalExperience: -1 }
			}
		]);
		res.send(leaderboard);
	} catch (err) {
		res.status(500).send({ message: "Unable to load leaderboard" });
	}
});

/**
 * @route GET /community/:id
 * @param {string} id - Community ID
 * @returns {Community} - Community object
 */
communityRouter.get("/:id", async (req, res) => {
	const community = await CommunityModel.findById(req.params.id).lean();
	if (!community) {
		return res.status(404).send({ message: "Community not found" });
	}
	res.send(community);
});

/**
 * @route GET /community
 * @returns {Array} - Array of Community objects
 */
communityRouter.get("/", async (_, res) => {
	const communities = await CommunityModel.find({}).lean();
	res.send(communities);
});

export {
    communityRouter
}
