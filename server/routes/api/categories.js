let router = require("express").Router();

let { OkResponse, BadRequestResponse } = require("express-http-response");

const { isAdmin, isToken } = require("../auth");

const CategorieModel = require("../../models/Categorie");

// Store Category for every API Call
router.use((req, res, next) => {
	CategorieModel.findOne({}, (err, result) => {
		if (!err && result !== null) {
			// console.log(result);
			req.categoryObj = result;
			next();
		} else {
			next(new BadRequestResponse("Categories not found!", 423));
			return;
		}
	});
});

// get category for every time categorySlug given
router.param("category", (req, res, next, category) => {
	// console.log(category);
	if (category === undefined || category.trim() === null) {
		next(new BadRequestResponse("Missing required parameter", 422));
		return;
	}
	req.oldCategory = category;
	// console.log(req.oldCategory);
	next();
});

// View All Categories
router.get("/categories", isToken, isAdmin, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};

	let query = {};
	// console.log(query);

	CategorieModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			next(new BadRequestResponse("Server Error"), 500);
			return;
		}
		// console.log(result);
		result.docs = result.docs.map((categories) => categories.toJSON());
		let data = result.docs;
		// console.log(":::Result:::::", data[0].categories);
		// console.log(":::Result Docs:::::", result.docs);
		next(new OkResponse({ categories: data[0].categories }));
		return;
	}).catch((e) => {
		// console.log(e);
		next(new BadRequestResponse(e.error));
		return;
	});
});

// Add Category
router.post("/addCategory", isToken, isAdmin, (req, res, next) => {
	const category = req.body.category;
	if (category === undefined || category === null) {
		next(new BadRequestResponse("Missing required parameter", 422));
		return;
	}

	req.categoryObj.categories = req.categoryObj.categories.concat(category);
	// console.log(req.categoryObj);
	req.categoryObj
		.save()
		.then((result) => {
			next(new OkResponse(result));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

// Remove Category
router.put("/removeCategory", isToken, isAdmin, (req, res, next) => {
	let categories = req.categoryObj.categories;
	// console.log(req.query.category);
	// console.log(categories);
	const index = categories.indexOf(req.query.category);
	if (index === -1) {
		next(new BadRequestResponse("No category Found"));
		return;
	}
	// console.log("::::::::::index:::::::::", index);
	// console.log(categories);
	categories.splice(index, 1);
	// console.log(categories);
	req.categoryObj
		.save()
		.then((result) => {
			next(new OkResponse(result));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

// Update Specific Category
router.put("/updateCategory/:category", isToken, isAdmin, (req, res, next) => {
	// console.log(req.oldCategory);
	// console.log(req.body.category);
	const newCategory = req.body.category;
	if (newCategory === undefined || newCategory.trim() === null) {
		next(new BadRequestResponse("Missing required parameter", 422));
		return;
	}
	let categories = req.categoryObj.categories;
	// console.log(req.query.category);
	console.log(categories);
	const index = categories.indexOf(req.oldCategory);
	// console.log("::::::::::index:::::::::", index);
	// console.log(categories);
	categories.splice(index, 1, newCategory);
	// console.log(categories);
	req.categoryObj
		.save()
		.then((result) => {
			next(new OkResponse(result));
			return;
		})
		.catch((err) => {
			next(new BadRequestResponse(err));
			return;
		});
});

module.exports = router;
