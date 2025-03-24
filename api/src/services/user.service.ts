import { User, UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/error";

export class UserService {
  private userModel = new UserModel();

  async register(
    email: string,
    password: string,
    role: "customer" | "seller" = "customer"
  ): Promise<{ user: User; token: string }> {
    const existingUser = await this.userModel.findByEmail(email);
    if (existingUser) {
      throw new CustomError("Email already in use", 400);
    }

    const user = await this.userModel.create({ email, password, role });
    const token = this.generateToken(user);

    return { user: { ...user, password: "" }, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new CustomError("Invalid email or password", 401);
    }

    const isPasswordValid = await this.userModel.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new CustomError("Invalid email or password", 401);
    }

    const token = this.generateToken(user);
    return { user: { ...user, password: "" }, token };
  }

  private generateToken(user: User): string {
    const signOptions: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "1d") as jwt.SignOptions["expiresIn"],
    };

    return jwt.sign(
      { id: user.id, email: user.email, role: user.role } as object,
      process.env.JWT_SECRET || "fallback_secret",
      signOptions
    );
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userModel.findById(id);
    if (user) {
      // Don't return the password
      return { ...user, password: "" };
    }
    return null;
  }
}
