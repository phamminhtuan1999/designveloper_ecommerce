import pool from "../config/database";
import bcrypt from "bcrypt";

export interface User {
  id?: number;
  email: string;
  password: string;
  role?: "customer" | "seller";
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  private db = pool;

  async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await this.db.execute(query, [email]);
    const users = rows as User[];
    return users.length ? users[0] : null;
  }

  async findById(id: number): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await this.db.execute(query, [id]);
    const users = rows as User[];
    return users.length ? users[0] : null;
  }

  async create(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    let query: string;
    let params: any[];

    if (user.role === undefined) {
      query = "INSERT INTO users (email, password) VALUES (?, ?)";
      params = [user.email, hashedPassword];
    } else {
      query = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
      params = [user.email, hashedPassword, user.role];
    }

    const [result] = await this.db.execute(query, params);
    const insertId = (result as any).insertId;
    return { ...user, id: insertId, password: hashedPassword };
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
