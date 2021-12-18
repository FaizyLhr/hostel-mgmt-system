const User = require("../models/User");

async function seedUser() {
	// Seed Admin
	{
		let newUser = new User();
		newUser.role = 1;

		newUser.email = "admin@gmail.com";
		newUser.firstName = "admin";
		newUser.lastName = "admin";

		newUser.setPassword("1234");

		newUser.isEmailVerified = true;

		// console.log(newUser);
		// console.log("Admin Seeded");

		await newUser.save();
	}
	// Seed Staff
	{
		let newUser = new User();
		newUser.role = 2;

		newUser.email = "staff@gmail.com";
		newUser.firstName = "staff";
		newUser.lastName = "staff";
		newUser.jobDescription = "Developer";
		newUser.workingDuration = 2;

		newUser.setPassword("1234");

		newUser.isEmailVerified = true;

		// console.log(newUser);
		// console.log("Tutor Seeded");

		await newUser.save();
	}
	// Seed Customer
	{
		let newUser = new User();
		newUser.role = 3;

		newUser.email = "customer@gmail.com";
		newUser.firstName = "customer";
		newUser.lastName = "customer";
		newUser.noOfStayDays = 2;

		newUser.setPassword("faizy");

		newUser.isEmailVerified = true;

		// console.log(newUser);
		// console.log("Student Seeded");

		await newUser.save();
	}
	console.log("Default Users Seeded");
}

module.exports = seedUser;