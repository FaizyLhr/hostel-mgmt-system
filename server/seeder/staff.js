const faker = require("faker");
const User = require("../models/User");

async function seedStaff() {
	// Staff Seeder
	for (let i = 0; i < 10; i++) {
		let newUser = new User();
		newUser.role = 2;

		newUser.email = faker.internet.email();

		newUser.firstName = faker.lorem.word(5);
		newUser.lastName = faker.lorem.word(5);

		newUser.jobDescription = faker.lorem.word(5);
		newUser.workingDuration = faker.datatype.number({
			min: 1,
			max: 5,
		});

		newUser.setPassword(faker.datatype.string());

		newUser.isEmailVerified = faker.datatype.boolean();

		await newUser.save();
	}

	console.log("Staff Seeded");
}

module.exports = seedStaff;