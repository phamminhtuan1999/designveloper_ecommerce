import { User, UserModel } from "../models/user.model";
import bcrypt from "bcrypt";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  role?: "customer" | "seller";
}

export class AuthService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async register(
    credentials: RegisterCredentials
  ): Promise<Omit<User, "password">> {
    const { email, password, role } = credentials;
    const existingUser = await this.userModel.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await this.userModel.create({ email, password, role });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(credentials: LoginCredentials): Promise<Omit<User, "password">> {
    const { email, password } = credentials;
    const user = await this.userModel.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await this.userModel.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async logout(userId: number): Promise<void> {
    // Since we're using JWT, we don't need to do anything on the server
    // The client will handle removing the token
    // If you implement a token blacklist or session store later, add that logic here
  }
}
