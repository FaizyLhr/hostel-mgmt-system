const faker = require("faker");
const Toll = require("../models/Toll");
const User = require("../models/User");

async function seedToll() {
	const getUser = await User.find({ role: 2 });
	for (let i = 0; i < 20; i++) {
		let newToll = new Toll();

		newToll.project = faker.commerce.productName();
		newToll.area = faker.address.city();
		newToll.trialPrice = faker.commerce.price();
		newToll.singlePrice = faker.commerce.price();
		newToll.groupPrice = faker.commerce.price();
		newToll.yoshinoriPrice = faker.commerce.price();
		newToll.status = faker.datatype.boolean();
		newToll.tutor = getUser[i]._id;

		await newToll.save();
	}
	console.log("Tolls Seeded");
}
module.exports = seedToll;
