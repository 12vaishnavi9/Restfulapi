import express from "express";
import { createNoteController,deleteNoteController,getNoteController, updateNoteController} from "../controllers/noteController.js";
import {requireSignIn} from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post('/create-note',requireSignIn,createNoteController);
router.delete('/delete-note/:id',requireSignIn,deleteNoteController);
router.get('/get-notes',requireSignIn,getNoteController);
router.put('/update-note/:id',requireSignIn,updateNoteController);
export default router;