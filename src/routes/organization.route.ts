import express from "express";
import {
  getOrganizationsController,
  getOrganizationByIdController,
  updateOrganizationController,
  deleteOrganizationController,
} from "../controllers/organization.controller";

const orgsRoute = express.Router();

orgsRoute.get("/organizations", getOrganizationsController);
orgsRoute.get("/organizations/:id", getOrganizationByIdController);
orgsRoute.patch("/organizations/:id", updateOrganizationController);
orgsRoute.delete("/organizations/:id", deleteOrganizationController);

export default orgsRoute;
