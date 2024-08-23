import { Request, Response } from "express";
import { ZodError } from "zod";
import { OrganizationService } from "../services/organization.service";
import {
  OrganizationSchema,
  OrganizationUpdateSchema,
} from "../validations/orgSchema";

const organizationService = new OrganizationService();

export const getOrganizationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const organizations = await organizationService.getAllOrganizations();
    res.status(200).json(organizations);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const getOrganizationByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const organization = await organizationService.getOrganizationById(id);
    res.status(200).json(organization);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const updateOrganizationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const parseSchema = OrganizationUpdateSchema.safeParse(req.body);
    if (!parseSchema.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseSchema.error.errors,
      });
    }

    await organizationService.updateOrganization(id, parseSchema.data);
    res.status(200).send("Organization updated successfully");
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

export const deleteOrganizationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    await organizationService.deleteOrganization(id);
    res.status(200).send("Organization deleted successfully");
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
