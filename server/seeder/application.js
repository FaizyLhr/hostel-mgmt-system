const faker = require("faker");
const App = require("../models/Application");
const Course = require("../models/Course");
const User = require("../models/User");

async function seedApp() {
	const getTutor = await User.find({ role: 2 });
	const getStudent = await User.find({ role: 2 });
	const getCourse = await Course.find({});
	for (let i = 0; i < 20; i++) {
		let newApp = new App();
		newApp.projectCat = faker.datatype.array(3);
		newApp.area = faker.address.city();
		newApp.coursePrice = faker.datatype.array(2);
		newApp.remarks = faker.lorem.words(5);
		newApp.isPosted = faker.datatype.boolean();
		newApp.isPaid = faker.datatype.boolean();
		newApp.startDate = faker.date.past();
		newApp.endDate = faker.date.future();
		newApp.duration = faker.datatype.number({
			min: 1,
			max: 2,
		});
		newApp.slotStart = new Date(
			newApp.endDate + newApp.duration * 60 * 60 * 1000
		);
		newApp.weekDay = faker.datatype.number({
			min: 0,
			max: 6,
		});
		newApp.status = faker.datatype.number({
			min: 0,
			max: 3,
		});
		newApp.course = getCourse[i]._id;
		newApp.student = getStudent[i]._id;
		newApp.tutor = getTutor[i]._id;

		await newApp.save();
	}
	console.log("Apps Seeded");
}
module.exports = seedApp;
