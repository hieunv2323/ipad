package com.banana.store.controller;

import com.banana.store.dto.ApiResponse;
import com.banana.store.entity.Product;
import com.banana.store.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAll() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.ok(products, "Lấy danh sách sản phẩm thành công!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable String id) {
        try {
            Product p = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.ok(p));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> create(@RequestBody Product input) {
        try {
            Product created = productService.createProduct(input);
            return ResponseEntity.ok(ApiResponse.ok(created, "Thêm sản phẩm mới thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> update(@PathVariable String id, @RequestBody Product input) {
        try {
            Product updated = productService.updateProduct(id, input);
            return ResponseEntity.ok(ApiResponse.ok(updated, "Cập nhật sản phẩm thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.ok(null, "Xóa sản phẩm thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
}
