import express from "express";
import {
  getOrganizationsController,
  getOrganizationByIdController,
  updateOrganizationController,
  deleteOrganizationController,
} from "../controllers/organization.controller";
import {
  getParentsController,
  getParentByIdController,
  updateParentController,
  deleteParentController,
} from "../controllers/parents.controller";

import {
  getSchoolsController,
  getSchoolByIdController,
  updateSchoolController,
  deleteSchoolController,
} from "../controllers/schools.controller";

const orgsRoute = express.Router();

orgsRoute.get("/organizations", getOrganizationsController);
orgsRoute.get("/organizations/:id", getOrganizationByIdController);
orgsRoute.patch("/organizations/:id", updateOrganizationController);
orgsRoute.delete("/organizations/:id", deleteOrganizationController);

orgsRoute.get("/parents", getParentsController);
orgsRoute.get("/parents/:id", getParentByIdController);
orgsRoute.patch("/parents/:id", updateParentController);
orgsRoute.delete("/parents/:id", deleteParentController);

orgsRoute.get("/schools", getSchoolsController);
orgsRoute.get("/schools/:id", getSchoolByIdController);
orgsRoute.patch("/schools/:id", updateSchoolController);
orgsRoute.delete("/schools/:id", deleteSchoolController);

export default orgsRoute;
