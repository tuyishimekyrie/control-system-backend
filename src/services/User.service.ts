import { dbObj } from "../../drizzle/db"; 
import { users } from "../models";
import bcrypt from "bcryptjs"; 

export class UserService {
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10); // Hash the password with a salt round of 10
  }

  public async registerUser(
    name: string,
    email: string,
    image: string,
    password: string
  ): Promise<void> {
    try {
      // Hash the password
      const hashedPassword = await this.hashPassword(password);

      // Insert new user into the database
      await (await dbObj).insert(users).values({
        name,
        email,
        image,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        role:"user"
      });

      console.log("User registered successfully");
    } catch (error:any) {
      console.error(`Error registering user: ${error.message}`);
      throw error; 
    }
  }
}
