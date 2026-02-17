package com.crm.auth.service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.crm.auth.config.JwtTokenProvider;
import com.crm.auth.dto.AuthResponse;
import com.crm.auth.dto.LoginRequest;
import com.crm.auth.dto.RegisterRequest;
import com.crm.auth.entity.Role;
import com.crm.auth.entity.User;
import com.crm.auth.repository.RoleRepository;
import com.crm.auth.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Register a new user
     */
    public String register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setCompanyName(request.getCompanyName());

        // companyId: use provided one (for team members) or generate new UUID (for
        // admin signup)
        if (request.getCompanyId() != null && !request.getCompanyId().isEmpty()) {
            user.setCompanyId(request.getCompanyId());
        } else {
            user.setCompanyId(UUID.randomUUID().toString());
        }

        // Assign role – public signups default to ROLE_ADMIN
        String roleName = request.getRole() != null ? request.getRole() : "ROLE_ADMIN";
        Role role = roleRepository.findByName(Role.RoleName.valueOf(roleName))
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        user.setRoles(Collections.singleton(role));

        userRepository.save(user);
        return "User registered successfully!";
    }

    /**
     * Authenticate user and return JWT token
     */
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        java.util.Set<String> permissions = new java.util.HashSet<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> {
                if (role.getPermissions() != null) {
                    role.getPermissions().forEach(p -> permissions.add(p.getName()));
                }
            });
        }

        // Add direct user permissions
        if (user.getPermissions() != null) {
            user.getPermissions().forEach(p -> permissions.add(p.getName()));
        }

        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getCompanyName(), user.getCompanyId(), roles, permissions);
    }

    public List<String> getRoles(User user) {
        return user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());
    }

    private com.crm.auth.dto.UserDTO toUserDTO(User user) {
        java.util.Set<String> permissions = new java.util.HashSet<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> {
                if (role.getPermissions() != null) {
                    role.getPermissions().forEach(p -> permissions.add(p.getName()));
                }
            });
        }
        if (user.getPermissions() != null) {
            user.getPermissions().forEach(p -> permissions.add(p.getName()));
        }

        return new com.crm.auth.dto.UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getCompanyName(),
                user.getCompanyId(),
                getRoles(user),
                user.isEnabled(),
                permissions);
    }

    /**
     * Get all users
     */
    public List<com.crm.auth.dto.UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get users filtered by companyId (UUID)
     */
    public List<com.crm.auth.dto.UserDTO> getUsersByCompanyId(String companyId) {
        return userRepository.findByCompanyId(companyId).stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update user role
     */
    public void updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(Role.RoleName.valueOf(roleName))
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.setRoles(Collections.singleton(role));
        userRepository.save(user);
    }

    @Autowired
    private com.crm.auth.repository.PermissionRepository permissionRepository;

    public void grantPermission(Long userId, String permissionName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.crm.auth.entity.Permission permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission not found: " + permissionName));

        user.getPermissions().add(permission);
        userRepository.save(user);
    }

    public void revokePermission(Long userId, String permissionName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.crm.auth.entity.Permission permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission not found: " + permissionName));

        user.getPermissions().remove(permission);
        userRepository.save(user);
    }

    public com.crm.auth.dto.UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserDTO(user);
    }
}
