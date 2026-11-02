package com.banana.store.repository;

import com.banana.store.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, String> {
    Optional<Registration> findByUsername(String username);
    boolean existsByUsername(String username);
}
