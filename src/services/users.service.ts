import { dbObj } from "../../drizzle/db";
import { users, NewUser, UserType } from "../models/User";
import { eq } from "drizzle-orm";

type UpdateUserData = Partial<Omit<NewUser, "createdAt">>;

export class UserService {
  public async getAllUsers(): Promise<UserType[]> {
    try {
      return await (await dbObj).select().from(users);
    } catch (error: any) {
      console.error(`Error fetching users: ${error.message}`);
      throw error;
    }
  }

  public async getUserById(id: string): Promise<UserType> {
    try {
      const user = await (await dbObj)
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (user.length === 0) {
        throw new Error("User not found");
      }

      return user[0];
    } catch (error: any) {
      console.error(`Error fetching user by ID: ${error.message}`);
      throw error;
    }
  }
  public async getUserByEmail(email: string): Promise<UserType> {
    try {
      const user = await (await dbObj)
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user.length === 0) {
        throw new Error("User not found");
      }

      return user[0];
    } catch (error: any) {
      console.error(`Error fetching user by Email: ${error.message}`);
      throw error;
    }
  }

  public async updateUser(id: string, updatedData: UpdateUserData) {
    try {
      const result = await (
        await dbObj
      )
        .update(users)
        .set({
          ...updatedData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
      console.log(`User with ID ${id} updated successfully`);
    } catch (error: any) {
      console.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  public async deleteUserById(id: string) {
    try {
      const result = await (await dbObj).delete(users).where(eq(users.id, id));
      console.log(`User with ID ${id} deleted successfully`);
    } catch (error: any) {
      console.error(`Error deleting user by ID: ${error.message}`);
      throw error;
    }
  }

  public async deleteAllUsers() {
    try {
      await (await dbObj).delete(users);
      console.log("All users deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting all users: ${error.message}`);
      throw error;
    }
  }
}
