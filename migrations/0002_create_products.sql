-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  series TEXT NOT NULL,
  capacity TEXT NOT NULL,
  color TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 5.0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  badge TEXT,
  is_hot INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index on series for fast filtering
CREATE INDEX IF NOT EXISTS idx_products_series ON products(series);

-- Seed initial product data
INSERT OR IGNORE INTO products (id, name, series, capacity, color, price, original_price, discount_percent, image, rating, reviews_count, badge, is_hot)
VALUES
('ipad-pro-m4-11', 'iPad Pro 11 inch M4 Wi-Fi 256GB', 'Pro', '256GB', 'Space Black', 28490000, 29990000, 5, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80', 4.9, 128, 'Trả góp 0%', 1),
('ipad-pro-m4-13', 'iPad Pro 13 inch M4 Wi-Fi 512GB', 'Pro', '512GB', 'Silver', 41990000, 44990000, 6, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80', 5.0, 84, 'Giảm 3 triệu', 1),
('ipad-air-m2-11', 'iPad Air 11 inch M2 Wi-Fi 128GB', 'Air', '128GB', 'Starlight', 16290000, 16990000, 4, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop&q=80', 4.8, 210, 'Giá rẻ quá', 1),
('ipad-air-m2-13', 'iPad Air 13 inch M2 Wi-Fi 256GB', 'Air', '256GB', 'Space Gray', 22490000, 23990000, 6, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80', 4.9, 95, 'Trả góp 0%', 0),
('ipad-gen-10', 'iPad Gen 10 10.9 inch Wi-Fi 64GB', 'Gen 10', '64GB', 'Blue', 9490000, 10990000, 13, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80', 4.7, 450, 'Bán chạy nhất', 1),
('ipad-mini-7', 'iPad mini 7 A17 Pro Wi-Fi 128GB', 'Mini', '128GB', 'Purple', 13990000, 14990000, 6, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop&q=80', 4.8, 67, 'Mới ra mắt', 0);
