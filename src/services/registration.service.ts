import { D1Database } from '@cloudflare/workers-types';
import { AppError } from '../middleware/error.middleware';

export interface RegistrationInput {
  fullName: string;
  phoneNumber: string;
  address: string;
  username: string;
  passwordHash: string;
}

export interface RegistrationOutput {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  username: string;
  createdAt: string;
}

export class RegistrationService {
  /**
   * Register new customer into D1 database
   */
  static async createRegistration(
    db: D1Database,
    input: RegistrationInput
  ): Promise<RegistrationOutput> {
    // 1. Check if username already exists
    const existing = await db
      .prepare('SELECT id FROM registrations WHERE username = ? LIMIT 1')
      .bind(input.username)
      .first();

    if (existing) {
      throw new AppError('Tên đăng nhập đã được đăng ký', 409);
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    try {
      await db
        .prepare(
          `INSERT INTO registrations (id, full_name, phone_number, address, username, password_hash, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          id,
          input.fullName,
          input.phoneNumber,
          input.address,
          input.username,
          input.passwordHash,
          createdAt
        )
        .run();
    } catch (err: any) {
      // Catch UNIQUE constraint violation from Cloudflare D1
      if (
        err?.message &&
        (err.message.includes('UNIQUE constraint failed') || err.message.toLowerCase().includes('unique'))
      ) {
        throw new AppError('Tên đăng nhập đã được đăng ký', 409);
      }
      throw err;
    }

    return {
      id,
      fullName: input.fullName,
      phoneNumber: input.phoneNumber,
      address: input.address,
      username: input.username,
      createdAt
    };
  }

  /**
   * Get all registered customers (excluding password and password_hash)
   */
  static async getAllRegistrations(db: D1Database): Promise<RegistrationOutput[]> {
    const { results } = await db
      .prepare(
        `SELECT id, full_name AS fullName, phone_number AS phoneNumber, address, username, created_at AS createdAt
         FROM registrations
         ORDER BY created_at DESC`
      )
      .all<RegistrationOutput>();

    return results || [];
  }

  /**
   * Find a user by username + passwordHash (for login)
   */
  static async findByCredentials(
    db: D1Database,
    username: string,
    passwordHash: string
  ): Promise<RegistrationOutput | null> {
    const user = await db
      .prepare(
        `SELECT id, full_name AS fullName, phone_number AS phoneNumber, address, username, created_at AS createdAt
         FROM registrations
         WHERE username = ? AND password_hash = ?
         LIMIT 1`
      )
      .bind(username, passwordHash)
      .first<RegistrationOutput>();

    return user || null;
  }
}
