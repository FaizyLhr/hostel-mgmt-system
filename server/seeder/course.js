const faker = require("faker");
const Course = require("../models/Course");
const User = require("../models/User");

async function seedCourse() {
	const getUser = await User.find({ role: 2 });
	for (let i = 0; i < 20; i++) {
		let newCourse = new Course();

		newCourse.nameChinese = faker.name.firstName(5);
		newCourse.nameEng = faker.name.firstName(5);
		newCourse.desc = faker.commerce.productDescription();
		newCourse.originalPrice = faker.commerce.price();
		newCourse.preferentialPrice = faker.commerce.price();
		newCourse.remarks = faker.lorem.words(5);
		newCourse.isDone = faker.datatype.boolean();
		newCourse.pic = faker.image.image();
		newCourse.startDate = faker.date.past();
		newCourse.endDate = faker.date.future();
		newCourse.duration = faker.datatype.number({
			min: 1,
			max: 2,
		});
		newCourse.slotStart = new Date(
			newCourse.endDate + newCourse.duration * 60 * 60 * 1000
		);
		newCourse.weekDay = faker.datatype.number({
			min: 0,
			max: 6,
		});
		newCourse.tutor = getUser[i]._id;

		await newCourse.save();
	}
	console.log("Courses Seeded");
}
module.exports = seedCourse;
