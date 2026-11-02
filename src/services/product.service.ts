import { D1Database } from '@cloudflare/workers-types';
import { AppError } from '../middleware/error.middleware';

export interface ProductInput {
  name: string;
  series: string;
  capacity: string;
  color: string;
  price: number;
  originalPrice: number;
  image: string;
  badge?: string;
  isHot?: boolean;
}

export interface ProductOutput {
  id: string;
  name: string;
  series: string;
  capacity: string;
  color: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  rating: number;
  reviewsCount: number;
  badge: string | null;
  isHot: boolean;
  createdAt: string;
}

export class ProductService {
  /**
   * Get all products from Cloudflare D1
   */
  static async getAllProducts(db: D1Database): Promise<ProductOutput[]> {
    const { results } = await db
      .prepare(
        `SELECT 
          id,
          name,
          series,
          capacity,
          color,
          price,
          original_price AS originalPrice,
          discount_percent AS discountPercent,
          image,
          rating,
          reviews_count AS reviewsCount,
          badge,
          is_hot AS isHot,
          created_at AS createdAt
         FROM products
         ORDER BY created_at DESC`
      )
      .all<any>();

    return (results || []).map(row => ({
      ...row,
      price: Number(row.price),
      originalPrice: Number(row.originalPrice),
      discountPercent: Number(row.discountPercent),
      rating: Number(row.rating),
      reviewsCount: Number(row.reviewsCount),
      isHot: Boolean(row.isHot)
    }));
  }

  /**
   * Create a new product in Cloudflare D1
   */
  static async createProduct(db: D1Database, input: ProductInput): Promise<ProductOutput> {
    const id = 'prod-' + crypto.randomUUID().slice(0, 8);
    const createdAt = new Date().toISOString();

    const price = Math.round(Number(input.price));
    const originalPrice = Math.round(Number(input.originalPrice) || input.price);

    let discountPercent = 0;
    if (originalPrice > price) {
      discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    const badge = input.badge?.trim() || null;
    const isHot = input.isHot ? 1 : 0;
    const rating = 5.0;
    const reviewsCount = 0;

    await db
      .prepare(
        `INSERT INTO products (
          id, name, series, capacity, color, price, original_price, discount_percent, image, rating, reviews_count, badge, is_hot, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.name,
        input.series,
        input.capacity,
        input.color,
        price,
        originalPrice,
        discountPercent,
        input.image,
        rating,
        reviewsCount,
        badge,
        isHot,
        createdAt
      )
      .run();

    return {
      id,
      name: input.name,
      series: input.series,
      capacity: input.capacity,
      color: input.color,
      price,
      originalPrice,
      discountPercent,
      image: input.image,
      rating,
      reviewsCount,
      badge,
      isHot: Boolean(isHot),
      createdAt
    };
  }

  /**
   * Update an existing product in Cloudflare D1
   */
  static async updateProduct(db: D1Database, id: string, input: ProductInput): Promise<ProductOutput> {
    const existing = await db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first<any>();
    if (!existing) {
      throw new AppError('Không tìm thấy sản phẩm cần cập nhật', 404);
    }

    const price = Math.round(Number(input.price));
    const originalPrice = Math.round(Number(input.originalPrice) || input.price);

    let discountPercent = 0;
    if (originalPrice > price) {
      discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    const badge = input.badge?.trim() || null;
    const isHot = input.isHot ? 1 : 0;

    await db
      .prepare(
        `UPDATE products 
         SET name = ?, series = ?, capacity = ?, color = ?, price = ?, original_price = ?, discount_percent = ?, image = ?, badge = ?, is_hot = ?
         WHERE id = ?`
      )
      .bind(
        input.name,
        input.series,
        input.capacity,
        input.color,
        price,
        originalPrice,
        discountPercent,
        input.image,
        badge,
        isHot,
        id
      )
      .run();

    return {
      id,
      name: input.name,
      series: input.series,
      capacity: input.capacity,
      color: input.color,
      price,
      originalPrice,
      discountPercent,
      image: input.image,
      rating: Number(existing.rating) || 5.0,
      reviewsCount: Number(existing.reviews_count) || 0,
      badge,
      isHot: Boolean(isHot),
      createdAt: existing.created_at
    };
  }

  /**
   * Delete a product by ID
   */
  static async deleteProduct(db: D1Database, id: string): Promise<boolean> {
    const res = await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return res.success;
  }
}

