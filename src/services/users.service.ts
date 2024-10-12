import { dbObj } from "../../drizzle/db";
import { users, NewUser, UserType } from "../models/User";
import { eq, and } from "drizzle-orm";

type UpdateUserData = Partial<Omit<NewUser, "createdAt">>;

export class UserService {
  public async getAllUsers(
    organizationId?: string,
    parentId?: string,
    schoolId?: string,
  ): Promise<UserType[]> {
    try {
      const query = (await dbObj).select().from(users);
      console.log("usersIds:", organizationId, schoolId);
      if (organizationId) {
        query.where(eq(users.organizationId, organizationId));
      } else if (parentId) {
        query.where(eq(users.parentId, parentId));
      } else if (schoolId) {
        query.where(eq(users.schoolId, schoolId));
      }

      return await query;
    } catch (error: any) {
      console.error(`Error fetching users: ${error.message}`);
      throw error;
    }
  }

  public async getUserById(
    id: string,
    organizationId?: string,
    parentId?: string,
    schoolId?: string,
  ): Promise<UserType> {
    try {
      const query = (await dbObj).select().from(users);

      if (organizationId) {
        query.where(
          and(eq(users.id, id), eq(users.organizationId, organizationId)),
        );
      } else if (parentId) {
        query.where(and(eq(users.id, id), eq(users.parentId, parentId)));
      } else if (schoolId) {
        query.where(and(eq(users.id, id), eq(users.schoolId, schoolId)));
      } else {
        query.where(eq(users.id, id));
      }

      const user = await query.limit(1);

      if (user.length === 0) {
        throw new Error("User not found");
      }

      return user[0];
    } catch (error: any) {
      console.error(`Error fetching user by ID: ${error.message}`);
      throw error;
    }
  }

  public async getUserByEmail(
    email: string,
    organizationId?: string,
    parentId?: string,
    schoolId?: string,
  ): Promise<UserType> {
    try {
      const query = (await dbObj).select().from(users);

      if (organizationId) {
        query.where(
          and(eq(users.email, email), eq(users.organizationId, organizationId)),
        );
      } else if (parentId) {
        query.where(and(eq(users.email, email), eq(users.parentId, parentId)));
      } else if (schoolId) {
        query.where(and(eq(users.email, email), eq(users.schoolId, schoolId)));
      } else {
        query.where(eq(users.email, email));
      }

      const user = await query.limit(1);

      if (user.length === 0) {
        throw new Error("User not found");
      }

      return user[0];
    } catch (error: any) {
      console.error(`Error fetching user by Email: ${error.message}`);
      throw error;
    }
  }


public async getOneUserByEmail(email: string): Promise<UserType> {
  try {
    const result = await (await dbObj)
      .select()
      .from(users)
      .where(eq(users.email, email)); // Correct column reference

    if (result.length === 0) {
      throw new Error("User not found");
    }

    return result[0]; // Return the first user found
  } catch (error: any) {
    console.error(`Error fetching user by email: ${error.message}`);
    throw error;
  }
}


  public async updateUser(
    id: string,
    updatedData: UpdateUserData,
    organizationId?: string,
    parentId?: string,
    schoolId?: string,
  ) {
    try {
      const query = (await dbObj).update(users).set({
        ...updatedData,
        updatedAt: new Date(),
      });

      if (organizationId) {
        query.where(
          and(eq(users.id, id), eq(users.organizationId, organizationId)),
        );
      } else if (parentId) {
        query.where(and(eq(users.id, id), eq(users.parentId, parentId)));
      } else if (schoolId) {
        query.where(and(eq(users.id, id), eq(users.schoolId, schoolId)));
      } else {
        query.where(eq(users.id, id));
      }

      await query;
      console.log(`User with ID ${id} updated successfully`);
    } catch (error: any) {
      console.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  public async deleteUserById(
    id: string,
    organizationId?: string,
    parentId?: string,
    schoolId?: string,
  ) {
    try {
      const query = (await dbObj).delete(users);

      if (organizationId) {
        query.where(
          and(eq(users.id, id), eq(users.organizationId, organizationId)),
        );
      } else if (parentId) {
        query.where(and(eq(users.id, id), eq(users.parentId, parentId)));
      } else if (schoolId) {
        query.where(and(eq(users.id, id), eq(users.schoolId, schoolId)));
      } else {
        query.where(eq(users.id, id));
      }

      await query;
      console.log(`User with ID ${id} deleted successfully`);
    } catch (error: any) {
      console.error(`Error deleting user by ID: ${error.message}`);
      throw error;
    }
  }

  public async deleteAllUsers(
    organizationId?: string,
    parentId?: string,
    schoolId?: string,
  ) {
    try {
      const query = (await dbObj).delete(users);

      if (organizationId) {
        query.where(eq(users.organizationId, organizationId));
      } else if (parentId) {
        query.where(eq(users.parentId, parentId));
      } else if (schoolId) {
        query.where(eq(users.schoolId, schoolId));
      }

      await query;
      console.log("All users deleted successfully");
    } catch (error: any) {
      console.error(`Error deleting all users: ${error.message}`);
      throw error;
    }
  }
}
