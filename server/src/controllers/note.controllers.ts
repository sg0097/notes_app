import { Request, Response } from 'express';
import { Note } from '../models/note.model';
import { IUser } from '../models/user.model';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: { id: string };
}

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Note content cannot be empty' });
  }
  try {
    const newNote = new Note({
      content,
      userId: req.user?.id,
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.userId.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'User not authorized to delete this note' });
    }
    await note.deleteOne();
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};