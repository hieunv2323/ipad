package com.banana.store.service;

import com.banana.store.entity.Product;
import com.banana.store.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với mã ID: " + id));
    }

    public Product createProduct(Product input) {
        String id = "prod-" + UUID.randomUUID().toString().substring(0, 8);
        double price = Math.round(input.getPrice());
        double originalPrice = Math.round(input.getOriginalPrice() != null ? input.getOriginalPrice() : price);

        int discountPercent = 0;
        if (originalPrice > price) {
            discountPercent = (int) Math.round(((originalPrice - price) / originalPrice) * 100);
        }

        Product product = Product.builder()
                .id(id)
                .name(input.getName().trim())
                .series(input.getSeries().trim())
                .capacity(input.getCapacity().trim())
                .color(input.getColor().trim())
                .price(price)
                .originalPrice(originalPrice)
                .discountPercent(discountPercent)
                .image(input.getImage().trim())
                .rating(5.0)
                .reviewsCount(0)
                .badge(input.getBadge() != null ? input.getBadge().trim() : null)
                .isHot(input.getIsHot() != null ? input.getIsHot() : false)
                .createdAt(LocalDateTime.now())
                .build();

        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product input) {
        Product existing = getProductById(id);

        double price = Math.round(input.getPrice());
        double originalPrice = Math.round(input.getOriginalPrice() != null ? input.getOriginalPrice() : price);

        int discountPercent = 0;
        if (originalPrice > price) {
            discountPercent = (int) Math.round(((originalPrice - price) / originalPrice) * 100);
        }

        existing.setName(input.getName().trim());
        existing.setSeries(input.getSeries().trim());
        existing.setCapacity(input.getCapacity().trim());
        existing.setColor(input.getColor().trim());
        existing.setPrice(price);
        existing.setOriginalPrice(originalPrice);
        existing.setDiscountPercent(discountPercent);
        existing.setImage(input.getImage().trim());
        existing.setBadge(input.getBadge() != null ? input.getBadge().trim() : null);
        existing.setIsHot(input.getIsHot() != null ? input.getIsHot() : false);

        return productRepository.save(existing);
    }

    public void deleteProduct(String id) {
        Product existing = getProductById(id);
        productRepository.delete(existing);
    }
}
