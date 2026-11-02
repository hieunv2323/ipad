import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { hashPassword } from '../utils/crypto.utils';
import { RegistrationService } from '../services/registration.service';

export class RegistrationController {
  /**
   * POST /api/registrations
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const db = req.env?.DB;
      if (!db) {
        throw new AppError('Database connection is not available', 500);
      }

      const body = req.body || {};

      // Helper function to validate and trim strings
      const trimValue = (val: any): string | null => {
        if (typeof val !== 'string') return null;
        const trimmed = val.trim();
        return trimmed.length > 0 ? trimmed : null;
      };

      const fullName = trimValue(body.fullName);
      const phoneNumber = trimValue(body.phoneNumber);
      const address = trimValue(body.address);
      const username = trimValue(body.username);
      const password = trimValue(body.password);

      // 1. All fields are required
      if (!fullName || !phoneNumber || !address || !username || !password) {
        throw new AppError('Vui lòng nhập đầy đủ thông tin', 400);
      }

      // 2. Validate phone number (digits only, 10-11 length)
      const phoneRegex = /^\d{10,11}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new AppError('Số điện thoại không hợp lệ', 400);
      }

      // 3. Hash password using Web Crypto API
      const passwordHash = await hashPassword(password);

      // 4. Save via RegistrationService
      const result = await RegistrationService.createRegistration(db, {
        fullName,
        phoneNumber,
        address,
        username,
        passwordHash
      });

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/registrations
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const db = req.env?.DB;
      if (!db) {
        throw new AppError('Database connection is not available', 500);
      }

      const registrations = await RegistrationService.getAllRegistrations(db);

      return res.status(200).json({
        success: true,
        data: registrations
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/registrations/login
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const db = req.env?.DB;
      if (!db) {
        throw new AppError('Database connection is not available', 500);
      }

      const { username, password } = req.body || {};
      if (!username || !password) {
        throw new AppError('Vui lòng nhập tên đăng nhập và mật khẩu', 400);
      }

      const passwordHash = await hashPassword(password.trim());

      const user = await RegistrationService.findByCredentials(db, username.trim(), passwordHash);
      if (!user) {
        throw new AppError('Tên đăng nhập hoặc mật khẩu không đúng', 401);
      }

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}
