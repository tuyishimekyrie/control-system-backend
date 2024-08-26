import { Request, Response } from "express";
import { UserService } from "../services/users.service";

const userService = new UserService();

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).send(`User not found: ${error.message}`);
  }
};
export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).send(`User not found: ${error.message}`);
  }
};
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.updateUser(id, req.body);
    res.status(200).send(`User with ID ${id} updated successfully`);
  } catch (error: any) {
    res.status(404).send(`User not found: ${error.message}`);
  }
};

export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUserById(id);
    res.status(200).send(`User with ID ${id} deleted successfully`);
  } catch (error: any) {
    res.status(404).send(`User not found: ${error.message}`);
  }
};

export const deleteAllUsersController = async (req: Request, res: Response) => {
  try {
    await userService.deleteAllUsers();
    res.status(200).send("All users deleted successfully");
  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
