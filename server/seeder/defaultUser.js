const User = require("../models/User");

async function seedUser() {
	// Seed Admin
	{
		let newUser = new User();

		newUser.email = "admin@gmail.com";
		newUser.role = 1;
		newUser.nameChinese = "admin";
		newUser.nameEng = "admin";
		newUser.phone = "123466789865";
		newUser.age = 23;
		newUser.gender = 1;
		newUser.profilePic = "admin.png";
		newUser.backgroundPic = "adminBg.png";

		newUser.setPassword("faizy");

		newUser.isEmailVerified = true;

		newUser.tutor.expertise = "null";
		newUser.tutor.experience = "null";

		// console.log(newUser);
		// console.log("Admin Seeded");

		await newUser.save();
	}
	// Seed Tutor
	{
		let newUser = new User();

		newUser.email = "tutor@gmail.com";
		newUser.category = ["Yoga"];
		newUser.nameChinese = "tutor";
		newUser.nameEng = "tutor";
		newUser.phone = "12345789965";
		newUser.age = 12;
		newUser.gender = 1;
		newUser.profilePic = "tutor.png";
		newUser.backgroundPic = "tutorBg.png";

		newUser.setPassword("faizy");

		newUser.isEmailVerified = true;

		newUser.role = 2;
		newUser.tutor.expertise = "dance";
		newUser.tutor.experience = "Over 100 peoples";
		newUser.tutor.fbLink = "link";
		newUser.tutor.instaLink = "link";
		newUser.tutor.youtubeLink = "link";

		// console.log(newUser);
		// console.log("Tutor Seeded");

		await newUser.save();
	}
	// Seed Student
	{
		let newUser = new User();

		newUser.email = "student@gmail.com";
		newUser.category = "yoga";
		newUser.nameChinese = "student";
		newUser.nameEng = "student";
		newUser.phone = "41234546648468";
		newUser.age = 12;
		newUser.gender = 2;
		newUser.profilePic = "student.png";
		newUser.backgroundPic = "studentBg.png";

		newUser.setPassword("faizy");

		newUser.isEmailVerified = true;

		newUser.role = 3;

		newUser.tutor.expertise = "null";
		newUser.tutor.experience = "null";

		newUser.student.intro = "Kean to learn";
		newUser.student.interested = "Exercise";

		// console.log(newUser);
		// console.log("Student Seeded");

		await newUser.save();
	}
	console.log("Default Users Seeded");
}

module.exports = seedUser;
