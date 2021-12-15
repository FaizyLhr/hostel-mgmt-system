const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const BedSchema = new mongoose.Schema(
	{
		bedNum: { type: Number, default: 0 },
		isFree: { type: Boolean, default: true },
		allocatedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true }
);
BedSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Bed", BedSchema);
