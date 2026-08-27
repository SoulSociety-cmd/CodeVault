import mongoose from 'mongoose'

const snippetVersionSchema = new mongoose.Schema(
  {
    snippetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Snippet', required: true, index: true },
    version: { type: Number, required: true, min: 1 },
    code: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

snippetVersionSchema.index({ snippetId: 1, version: 1 }, { unique: true })

export default mongoose.model('SnippetVersion', snippetVersionSchema)