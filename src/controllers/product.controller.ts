import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { ProductService } from '../services/product.service';

export class ProductController {
  /**
   * GET /api/products
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const db = req.env?.DB;
      if (!db) {
        throw new AppError('Database connection is not available', 500);
      }

      const products = await ProductService.getAllProducts(db);
      return res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/products
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const db = req.env?.DB;
      if (!db) {
        throw new AppError('Database connection is not available', 500);
      }

      const body = req.body || {};

      const trimValue = (val: any): string | null => {
        if (typeof val !== 'string') return null;
        const trimmed = val.trim();
        return trimmed.length > 0 ? trimmed : null;
      };

      const name = trimValue(body.name);
      const series = trimValue(body.series);
      const capacity = trimValue(body.capacity);
      const color = trimValue(body.color);
      const image = trimValue(body.image);
      const badge = trimValue(body.badge) || undefined;
      const isHot = Boolean(body.isHot);

      const price = Number(body.price);
      const originalPrice = Number(body.originalPrice || body.price);

      if (!name || !series || !capacity || !color || !image) {
        throw new AppError('Vui lòng điền đầy đủ tên, dòng máy, dung lượng, màu sắc và hình ảnh sản phẩm', 400);
      }

      if (isNaN(price) || price <= 0) {
        throw new AppError('Giá bán phải là số hợp lệ lớn hơn 0', 400);
      }

      const newProduct = await ProductService.createProduct(db, {
        name,
        series,
        capacity,
        color,
        price,
        originalPrice,
        image,
        badge,
        isHot
      });

      return res.status(201).json({
        success: true,
        message: 'Thêm sản phẩm mới thành công',
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/:id
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const db = req.env?.DB;
      if (!db) {
        throw new AppError('Database connection is not available', 500);
      }

      const { id } = req.params;
      if (!id) {
        throw new AppError('Mã sản phẩm không hợp lệ', 400);
      }

      const body = req.body || {};

      const trimValue = (val: any): string | null => {
        if (typeof val !== 'string') return null;
        const trimmed = val.trim();
        return trimmed.length > 0 ? trimmed : null;
      };

      const name = trimValue(body.name);
      const series = trimValue(body.series);
      const capacity = trimValue(body.capacity);
      const color = trimValue(body.color);
      const image = trimValue(body.image);
      const badge = trimValue(body.badge) || undefined;
      const isHot = Boolean(body.isHot);

      const price = Number(body.price);
      const originalPrice = Number(body.originalPrice || body.price);

      if (!name || !series || !capacity || !color || !image) {
        throw new AppError('Vui lòng điền đầy đủ thông tin sản phẩm', 400);
      }

      if (isNaN(price) || price <= 0) {
        throw new AppError('Giá bán phải là số hợp lệ lớn hơn 0', 400);
      }

      const updatedProduct = await ProductService.updateProduct(db, id, {
        name,
        series,
        capacity,
        color,
        price,
        originalPrice,
        image,
        badge,
        isHot
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật sản phẩm thành công',
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/products/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const db = req.env?.DB;
      if (!db) {
        throw new AppError('Database connection is not available', 500);
      }

      const { id } = req.params;
      if (!id) {
        throw new AppError('Mã sản phẩm không hợp lệ', 400);
      }

      await ProductService.deleteProduct(db, id);

      return res.status(200).json({
        success: true,
        message: 'Đã xóa sản phẩm thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

