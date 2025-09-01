import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  content: string;
  userId: Types.ObjectId;
}

const noteSchema = new Schema<INote>({
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Note = model<INote>('Note', noteSchema);