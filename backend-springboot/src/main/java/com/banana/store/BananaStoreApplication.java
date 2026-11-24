package com.banana.store;

import com.banana.store.entity.Product;
import com.banana.store.repository.ProductRepository;
import com.banana.store.service.ReviewService;
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
    public CommandLineRunner initData(ProductRepository productRepository, ReviewService reviewService) {
        return args -> {
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
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-11inch-spaceblack?wid=800&hei=800&fmt=png-alpha")
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
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-silver?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(84)
                    .badge("Giảm 3 triệu")
                    .isHot(true)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-46d008e2")
                    .name("iPad Pro 13 inch M4 Wi-Fi 1TB Nano-texture")
                    .series("Pro")
                    .capacity("1TB")
                    .color("Silver")
                    .price(52490000.0)
                    .originalPrice(55990000.0)
                    .discountPercent(6)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-silver?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(1)
                    .badge("Chuyên Đồ Họa")
                    .isHot(true)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-5c7e065e")
                    .name("iPad Pro 11 inch M4 Wi-Fi + 5G 512GB")
                    .series("Pro")
                    .capacity("512GB")
                    .color("Space Black")
                    .price(34990000.0)
                    .originalPrice(37490000.0)
                    .discountPercent(7)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-11inch-spaceblack?wid=800&hei=800&fmt=png-alpha")
                    .rating(3.0)
                    .reviewsCount(1)
                    .badge("Bản 5G Siêu Tốc")
                    .isHot(true)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-018b074c")
                    .name("iPad Pro 12.9 inch M2 Wi-Fi 128GB")
                    .series("Pro")
                    .capacity("128GB")
                    .color("Space Gray")
                    .price(24500000.0)
                    .originalPrice(27990000.0)
                    .discountPercent(12)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-spaceblack?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(1)
                    .badge("Giảm Sốc 3.5Tr")
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
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-11inch-starlight?wid=800&hei=800&fmt=png-alpha")
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
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-13inch-space-gray?wid=800&hei=800&fmt=png-alpha")
                    .rating(4.9)
                    .reviewsCount(95)
                    .badge("Trả góp 0%")
                    .isHot(false)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-b02fb256")
                    .name("iPad Air 5 M1 10.9 inch Wi-Fi 64GB")
                    .series("Air")
                    .capacity("64GB")
                    .color("Space Gray")
                    .price(12990000.0)
                    .originalPrice(14990000.0)
                    .discountPercent(13)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-11inch-space-gray?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(1)
                    .badge("Sinh Viên Ưa Chuộng")
                    .isHot(true)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-5573cee9")
                    .name("iPad Air 13 inch M2 Wi-Fi 512GB")
                    .series("Air")
                    .capacity("512GB")
                    .color("Purple")
                    .price(27990000.0)
                    .originalPrice(29990000.0)
                    .discountPercent(7)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-13inch-purple?wid=800&hei=800&fmt=png-alpha")
                    .rating(4.0)
                    .reviewsCount(1)
                    .badge("Màn Hình Lớn")
                    .isHot(false)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-b93e525f")
                    .name("iPad Air 11 inch M2 Wi-Fi + 5G 128GB")
                    .series("Air")
                    .capacity("128GB")
                    .color("Blue")
                    .price(19990000.0)
                    .originalPrice(21490000.0)
                    .discountPercent(7)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-11inch-blue?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(1)
                    .badge("Hỗ trợ 5G")
                    .isHot(false)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-af9dc0c2")
                    .name("iPad Air 11 inch M2 Wi-Fi 256GB")
                    .series("Air")
                    .capacity("256GB")
                    .color("Starlight")
                    .price(18490000.0)
                    .originalPrice(19990000.0)
                    .discountPercent(8)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202405-11inch-starlight?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(1)
                    .badge("Trả góp 0%")
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
                    .discountPercent(7)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-mini-finish-select-gallery-202410-purple?wid=800&hei=800&fmt=png-alpha")
                    .rating(4.8)
                    .reviewsCount(67)
                    .badge("Mới ra mắt")
                    .isHot(false)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-af321389")
                    .name("iPad mini 7 A17 Pro Wi-Fi 256GB")
                    .series("Mini")
                    .capacity("256GB")
                    .color("Blue")
                    .price(16490000.0)
                    .originalPrice(17990000.0)
                    .discountPercent(8)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-mini-finish-select-gallery-202410-blue?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(1)
                    .badge("Gaming Nhỏ Gọn")
                    .isHot(true)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-0f1f4d50")
                    .name("iPad mini 6 Wi-Fi 64GB")
                    .series("Mini")
                    .capacity("64GB")
                    .color("Starlight")
                    .price(10990000.0)
                    .originalPrice(12490000.0)
                    .discountPercent(12)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-mini-finish-select-gallery-202410-starlight?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(2)
                    .badge("Giảm Giá Sâu")
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
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue?wid=800&hei=800&fmt=png-alpha")
                    .rating(4.7)
                    .reviewsCount(450)
                    .badge("Bán chạy nhất")
                    .isHot(true)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-97e785bf")
                    .name("iPad Gen 10 10.9 inch Wi-Fi 256GB")
                    .series("Gen 10")
                    .capacity("256GB")
                    .color("Pink")
                    .price(12490000.0)
                    .originalPrice(13990000.0)
                    .discountPercent(11)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-pink?wid=800&hei=800&fmt=png-alpha")
                    .rating(5.0)
                    .reviewsCount(1)
                    .badge("Màu Hot Trend")
                    .isHot(false)
                    .createdAt(LocalDateTime.now())
                    .build(),

                Product.builder()
                    .id("prod-7d6e371a")
                    .name("iPad Gen 9 10.2 inch Wi-Fi 64GB")
                    .series("Gen 9")
                    .capacity("64GB")
                    .color("Silver")
                    .price(6990000.0)
                    .originalPrice(8490000.0)
                    .discountPercent(18)
                    .image("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-2021-hero-silver-wifi-select?wid=800&hei=800&fmt=png-alpha")
                    .rating(4.0)
                    .reviewsCount(1)
                    .badge("Giá Rẻ Nhất")
                    .isHot(true)
                    .createdAt(LocalDateTime.now())
                    .build()
            );

            productRepository.saveAll(sampleProducts);
            System.out.println("✅ [Spring Boot] Initialized/Updated 17 pristine iPad products into Database!");
            reviewService.seedSampleReviewsIfEmpty();
        };
    }
}
