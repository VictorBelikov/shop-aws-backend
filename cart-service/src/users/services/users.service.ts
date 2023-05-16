import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { User, userTableName } from '../models';
import { CustomError, getDbClient } from '@shared';
import bcrypt from 'bcryptjs';
import { QueryResult } from 'pg';

@Injectable()
export class UsersService {
  async findOne(userId: string): Promise<User> {
    const dbClient = await getDbClient();

    try {
      const {
        rows: [user],
      }: QueryResult<User> = await dbClient.query(`
        select id, email, name from ${userTableName}
        where id = '${userId}';
      `);

      return user;
    } catch (e) {
      throw CustomError(e);
    } finally {
      await dbClient.end();
    }
  }

  async createOne({ name, password, email }: User): Promise<User> {
    const dbClient = await getDbClient();

    try {
      const userId = v4();
      const hashedPassword = await bcrypt.hash(password, 10);

      await dbClient.query(`
        insert into ${userTableName} (id, email, password, name)
        values ('${userId}', '${email}', '${hashedPassword}', '${name}'});
      `);

      return {
        id: userId,
        name,
        email,
      };
    } catch (e) {
      throw CustomError(e);
    } finally {
      await dbClient.end();
    }
  }
}
