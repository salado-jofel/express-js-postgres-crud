import express from "express";
import {
  deleteContact,
  indexContacts,
  showContact,
  storeContact,
  updateContact,
} from "../controllers/contact-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/").get(authMiddleware, indexContacts).post(storeContact);

router
  .route("/:id")
  .get(authMiddleware, showContact)
  .patch(updateContact)
  .delete(deleteContact);

export default router;
