import mongoose from 'mongoose'

const collectionSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 1000 },
    snippets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Snippet' }],
  },
  { timestamps: true },
)

collectionSchema.index({ owner: 1, name: 1 }, { unique: true })

export default mongoose.model('Collection', collectionSchema)