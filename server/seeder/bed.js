const faker = require("faker");

const Bed = require("../models/Bed");
const User = require("../models/User");

let { beds } = require("../constants/beds");

async function seedBeds() {
	// console.log(beds);
	// const getUser = await User.find({ role: 2 });
	const getUser = await User.findOne({ role: 2 });

	for (let i = 0; i < 20; i++) {
		let newBed = new Bed();
		newBed.isFree = true;
		newBed.bedNum = i + 1;
		// newBed.allocatedTo = getUser._id;
		await newBed.save();
	}

	console.log("Beds Seeded");
}
module.exports = seedBeds;
