import noteModel from "../models/noteModel.js";
import userModel from "../models/userModel.js";

export const createNoteController = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title && !content) {
      return res.send({ message: "Both Content and Title are required" });
    }
    if (!title) {
      return res.send({ message: "Title is Required" });
    }
    if (!content) {
      return res.send({ message: "Content is Required" });
    }
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const note = await new noteModel({ title, content, user_: userId }).save();
    const formatOptions = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const formattedNote = {
      ...note._doc,
      updatedAt: new Date(note.updatedAt).toLocaleString('en-IN', formatOptions),
      createdAt: new Date(note.createdAt).toLocaleString('en-IN', formatOptions),
    };

    res.status(201).send({
      success: true,
      message: "Note Added Successfully",
      note: formattedNote,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: 'Error in adding a Note',
      err,
    });
  }
};

export const deleteNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const note = await noteModel.findById(id);

    if (!note) {
      return res.status(404).send({ message: 'Note not found' });
    }
    if (note.user_.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Forbidden - You do not have permission to delete this note' });
    }

    await noteModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Note Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while deleting Note",
      err,
    });
  }
};



export const updateNoteController = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const note = await noteModel.findByIdAndUpdate(id, { title, content }, { new: true });

    if (!note) {
      return res.status(404).send({ message: 'Note not found' });
    }

    const formatOptions = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const formattedNote = {
      ...note._doc,
      updatedAt: new Date(note.updatedAt).toLocaleString('en-IN', formatOptions),
      createdAt: new Date(note.createdAt).toLocaleString('en-IN', formatOptions),
    };

    res.status(200).send({
      success: true,
      message: "Note Updated Successfully",
      note: formattedNote,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while updating the note",
      err,
    });
  }
};

export const getNoteController = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const notes = await noteModel.find({ user_: req.user._id });
    const notesWithIST = notes.map(note => {
      const formatOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      return {
        ...note._doc,
        updatedAt: new Date(note.updatedAt).toLocaleString('en-IN', formatOptions),
        createdAt: new Date(note.createdAt).toLocaleString('en-IN', formatOptions),
      };
    });

    res.status(200).send({
      success: true,
      message: "All Notes List",
      notes: notesWithIST,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all notes",
    });
  }
};


