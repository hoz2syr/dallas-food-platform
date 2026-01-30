import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(username: string, passwordHash: string): Promise<User> {
    const user: User = {
      id: String(this.idCounter++),
      username,
      passwordHash,
    };
    this.users.push(user);
    return user;
  }
}
