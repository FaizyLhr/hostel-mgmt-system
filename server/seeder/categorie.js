const Categorie = require("../models/Categorie");
let { categories } = require("../constants/variables");

async function seedCategory() {
	let initial = new Categorie();

	initial.categories = categories;

	await initial.save();
	console.log("Categorie Seeded");
}
module.exports = seedCategory;
