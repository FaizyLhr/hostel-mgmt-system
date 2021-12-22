const faker = require("faker");
const User = require("../models/User");
const {
	beds
} = require("../constants/beds");

async function seedStaff() {
	// Customer Seeder
	for (let i = 0; i < 10; i++) {
		let newUser = new User();
		newUser.role = 3;
		newUser.email = faker.internet.email();
		newUser.firstName = faker.lorem.word(5);
		newUser.lastName = faker.lorem.word(5);

		newUser.allocatedBedNum = beds[i].bedNum;
		newUser.noOfStayDays = faker.datatype.number();

		newUser.gym = faker.datatype.boolean();
		newUser.meal = faker.datatype.number({
			min: 1,
			max: 5,
		});
		newUser.clothe = faker.datatype.number({
			min: 1,
			max: 5,
		});

		newUser.setPassword(faker.datatype.string());

		newUser.isEmailVerified = faker.datatype.boolean();

		await newUser.save();
	}

	console.log("Customer Seeded");
}

module.exports = seedStaff;