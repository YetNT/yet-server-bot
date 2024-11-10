const { model, Schema } = require("mongoose");

const counterSchema = new Schema({
    modelName: { type: String, required: true, unique: true },
    sequenceValue: { type: Number, required: true },
});

const Counter = model("Counter", counterSchema);

const incidentSchema = new Schema({
    incidentId: { type: Number, unique: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    reportedBy: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: {
        type: String,
        enum: ["warn", "ban", "mute", "kick"],
        required: true,
    },
});

// Pre-save hook to increment the counter for incidentId
incidentSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { modelName: "Incident" },
                { $inc: { sequenceValue: 1 } },
                { new: true, upsert: true }
            );
            this.incidentId = counter.sequenceValue;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Incident = model("incident", incidentSchema, "myserver");

module.exports = Incident;
