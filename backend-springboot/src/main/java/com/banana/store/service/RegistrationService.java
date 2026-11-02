package com.banana.store.service;

import com.banana.store.entity.Registration;
import com.banana.store.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;

    /**
     * Hash password using SHA-256 (matching Frontend/Backend WebCrypto logic)
     */
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Lỗi mã hóa mật khẩu", e);
        }
    }

    /**
     * Register customer
     */
    public Registration register(Registration req) {
        if (req.getUsername() == null || req.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên đăng nhập không được để trống");
        }

        if (registrationRepository.existsByUsername(req.getUsername().trim())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại trong hệ thống!");
        }

        String id = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        String passwordHash = hashPassword(req.getPasswordHash());

        Registration registration = Registration.builder()
                .id(id)
                .fullName(req.getFullName().trim())
                .phoneNumber(req.getPhoneNumber().trim())
                .address(req.getAddress().trim())
                .username(req.getUsername().trim())
                .passwordHash(passwordHash)
                .createdAt(LocalDateTime.now())
                .build();

        return registrationRepository.save(registration);
    }

    /**
     * Login customer
     */
    public Registration login(String username, String password) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
        }

        Registration user = registrationRepository.findByUsername(username.trim())
                .orElseThrow(() -> new IllegalArgumentException("Tên đăng nhập '" + username.trim() + "' chưa được đăng ký!"));

        String inputHash = hashPassword(password.trim());
        if (!user.getPasswordHash().equalsIgnoreCase(inputHash)) {
            throw new IllegalArgumentException("Mật khẩu không chính xác! Vui lòng thử lại.");
        }

        return user;
    }

    /**
     * Get all registrations
     */
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }
}
