package com.banana.store;

import com.banana.store.entity.Product;
import com.banana.store.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class BananaStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(BananaStoreApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                List<Product> sampleProducts = List.of(
                    Product.builder()
                        .id("ipad-pro-m4-11")
                        .name("iPad Pro 11 inch M4 Wi-Fi 256GB")
                        .series("Pro")
                        .capacity("256GB")
                        .color("Space Black")
                        .price(28490000.0)
                        .originalPrice(29990000.0)
                        .discountPercent(5)
                        .image("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80")
                        .rating(4.9)
                        .reviewsCount(128)
                        .badge("Trả góp 0%")
                        .isHot(true)
                        .createdAt(LocalDateTime.now())
                        .build(),

                    Product.builder()
                        .id("ipad-pro-m4-13")
                        .name("iPad Pro 13 inch M4 Wi-Fi 512GB")
                        .series("Pro")
                        .capacity("512GB")
                        .color("Silver")
                        .price(41990000.0)
                        .originalPrice(44990000.0)
                        .discountPercent(6)
                        .image("https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80")
                        .rating(5.0)
                        .reviewsCount(84)
                        .badge("Giảm 3 triệu")
                        .isHot(true)
                        .createdAt(LocalDateTime.now())
                        .build(),

                    Product.builder()
                        .id("ipad-air-m2-11")
                        .name("iPad Air 11 inch M2 Wi-Fi 128GB")
                        .series("Air")
                        .capacity("128GB")
                        .color("Starlight")
                        .price(16290000.0)
                        .originalPrice(16990000.0)
                        .discountPercent(4)
                        .image("https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop&q=80")
                        .rating(4.8)
                        .reviewsCount(210)
                        .badge("Giá rẻ quá")
                        .isHot(true)
                        .createdAt(LocalDateTime.now())
                        .build(),

                    Product.builder()
                        .id("ipad-air-m2-13")
                        .name("iPad Air 13 inch M2 Wi-Fi 256GB")
                        .series("Air")
                        .capacity("256GB")
                        .color("Space Gray")
                        .price(22490000.0)
                        .originalPrice(23990000.0)
                        .discountPercent(6)
                        .image("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80")
                        .rating(4.9)
                        .reviewsCount(95)
                        .badge("Trả góp 0%")
                        .isHot(false)
                        .createdAt(LocalDateTime.now())
                        .build(),

                    Product.builder()
                        .id("ipad-gen-10")
                        .name("iPad Gen 10 10.9 inch Wi-Fi 64GB")
                        .series("Gen 10")
                        .capacity("64GB")
                        .color("Blue")
                        .price(9490000.0)
                        .originalPrice(10990000.0)
                        .discountPercent(13)
                        .image("https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80")
                        .rating(4.7)
                        .reviewsCount(450)
                        .badge("Bán chạy nhất")
                        .isHot(true)
                        .createdAt(LocalDateTime.now())
                        .build(),

                    Product.builder()
                        .id("ipad-mini-7")
                        .name("iPad mini 7 A17 Pro Wi-Fi 128GB")
                        .series("Mini")
                        .capacity("128GB")
                        .color("Purple")
                        .price(13990000.0)
                        .originalPrice(14990000.0)
                        .discountPercent(6)
                        .image("https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop&q=80")
                        .rating(4.8)
                        .reviewsCount(67)
                        .badge("Mới ra mắt")
                        .isHot(false)
                        .createdAt(LocalDateTime.now())
                        .build()
                );

                productRepository.saveAll(sampleProducts);
                System.out.println("✅ [Spring Boot] Initialized sample iPad products into SQL Server!");
            }
        };
    }
}
