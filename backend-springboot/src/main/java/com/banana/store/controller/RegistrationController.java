package com.banana.store.controller;

import com.banana.store.dto.ApiResponse;
import com.banana.store.dto.LoginRequest;
import com.banana.store.entity.Registration;
import com.banana.store.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<ApiResponse<Registration>> register(@RequestBody Registration req) {
        try {
            // Mapping frontend property password -> passwordHash
            if (req.getPasswordHash() == null && req.getUsername() != null) {
                // If passed as password from frontend Jackson binding
            }
            Registration created = registrationService.register(req);
            return ResponseEntity.ok(ApiResponse.ok(created, "Đăng ký tài khoản thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi máy chủ: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Registration>> login(@RequestBody LoginRequest req) {
        try {
            Registration user = registrationService.login(req.getUsername(), req.getPassword());
            return ResponseEntity.ok(ApiResponse.ok(user, "Đăng nhập thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi đăng nhập: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Registration>>> getAll() {
        List<Registration> list = registrationService.getAllRegistrations();
        return ResponseEntity.ok(ApiResponse.ok(list, "Lấy danh sách khách hàng thành công!"));
    }
}
