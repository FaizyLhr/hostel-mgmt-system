const faker = require("faker");
const User = require("../models/User");

async function seedUser() {
	// Tutor Seeder
	for (let i = 0; i < 20; i++) {
		let newUser = new User();

		newUser.email = faker.internet.email();
		newUser.category = faker.datatype.array();
		newUser.nameChinese = faker.lorem.word(5);
		newUser.nameEng = faker.lorem.word(5);
		newUser.phone = faker.phone.phoneNumber("3#######");
		newUser.age = faker.datatype.number({
			min: 1,
			max: 150,
		});
		newUser.gender = faker.datatype.number({
			min: 1,
			max: 3,
		});
		newUser.profilePic = faker.datatype.array(1);
		newUser.backgroundPic = faker.image.avatar();

		newUser.setPassword(faker.datatype.string());

		newUser.isEmailVerified = true;

		newUser.role = 2;
		newUser.tutor.expertise = faker.lorem.word(5);
		newUser.tutor.experience = faker.lorem.word(5);
		newUser.tutor.fbLink = faker.datatype.string();
		newUser.tutor.instaLink = faker.datatype.string();
		newUser.tutor.youtubeLink = faker.datatype.string();

		await newUser.save();
	}
	// console.log("Tutors Seeded");

	// Student Seeder
	for (let i = 0; i < 20; i++) {
		let newUser = new User();

		newUser.email = faker.internet.email();
		newUser.category = faker.datatype.array();
		newUser.nameChinese = faker.lorem.word(5);
		newUser.nameEng = faker.lorem.word(5);
		newUser.phone = faker.phone.phoneNumber("3#######");
		newUser.age = faker.datatype.number({
			min: 1,
			max: 150,
		});
		newUser.gender = faker.datatype.number({
			min: 1,
			max: 3,
		});
		newUser.profilePic = faker.image.avatar();
		newUser.backgroundPic = faker.image.avatar();

		newUser.setPassword(faker.lorem.word(5));

		newUser.isEmailVerified = true;

		newUser.role = 3;
		newUser.tutor.expertise = "null";
		newUser.tutor.experience = "null";

		newUser.student.intro = faker.datatype.string();
		newUser.student.interested = faker.datatype.string();

		await newUser.save();
	}
	// console.log("Students Seeded");
	console.log("Users Seeded");
}

module.exports = seedUser;
