const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const BedSchema = new mongoose.Schema(
	{
		beds: { type: Array, default: null },
		isAllocated: { type: Boolean, default: false },
		allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);
BedSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Bed", BedSchema);
