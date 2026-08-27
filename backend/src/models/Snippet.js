import mongoose from 'mongoose'

const snippetSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', trim: true, maxlength: 1000 },
    code: { type: String, required: true },
    language: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    views: { type: Number, default: 0, min: 0 },
    favorites: { type: Number, default: 0, min: 0 },
    collectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
)

export default mongoose.model('Snippet', snippetSchema)