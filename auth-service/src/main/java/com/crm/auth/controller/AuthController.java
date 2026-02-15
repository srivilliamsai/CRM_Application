package com.crm.auth.controller;

import java.util.Collections;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crm.auth.dto.AuthResponse;
import com.crm.auth.dto.LoginRequest;
import com.crm.auth.dto.RegisterRequest;
import com.crm.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        String message = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Collections.singletonMap("message", message));
    }

    /**
     * POST /api/auth/login
     * Authenticate user and return JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        // Fetch permissions from the user's roles
        // Note: AuthService.login returns AuthResponse without permissions populated
        // yet if we didn't update AuthService.
        // We probably need to update AuthService instead, but since I can't overwrite
        // the whole service easily without reading it,
        // I will rely on AuthService to be updated or update it here if I have access
        // to User entity.
        // Wait, AuthService returns AuthResponse. I should update AuthService.java.
        // But I haven't read AuthService.java yet. Let me read it first to be safe.
        // Actually, let's just return the response for now and I will update
        // AuthService next.
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/auth/users
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<java.util.List<com.crm.auth.dto.UserDTO>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    /**
     * GET /api/auth/users/company/{companyId}
     * Get users filtered by companyId (UUID)
     */
    @GetMapping("/users/company/{companyId}")
    public ResponseEntity<java.util.List<com.crm.auth.dto.UserDTO>> getUsersByCompanyId(
            @PathVariable String companyId) {
        return ResponseEntity.ok(authService.getUsersByCompanyId(companyId));
    }
}
