package com.crm.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.crm.auth.entity.Role;
import com.crm.auth.repository.RoleRepository;

/**
 * Seeds default roles into the database on first startup.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private com.crm.auth.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.crm.auth.repository.PermissionRepository permissionRepository;

    @Override
    public void run(String... args) {
        // Seed Permissions
        String[] permissions = {
                "READ_CUSTOMERS", "WRITE_CUSTOMERS", "DELETE_CUSTOMERS",
                "READ_DEALS", "WRITE_DEALS", "DELETE_DEALS",
                "READ_TICKETS", "WRITE_TICKETS", "DELETE_TICKETS",
                "READ_CAMPAIGNS", "WRITE_CAMPAIGNS", "DELETE_CAMPAIGNS",
                "MANAGE_USERS", "VIEW_ANALYTICS"
        };

        for (String permName : permissions) {
            if (!permissionRepository.findByName(permName).isPresent()) {
                com.crm.auth.entity.Permission permission = new com.crm.auth.entity.Permission();
                permission.setName(permName);
                permission.setDescription("Permission to " + permName.toLowerCase().replace('_', ' '));
                permissionRepository.save(permission);
                System.out.println("Seeded permission: " + permName);
            }
        }

        // Seed Roles and Assign Permissions
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (!roleRepository.findByName(roleName).isPresent()) {
                Role role = new Role();
                role.setName(roleName);

                java.util.Set<com.crm.auth.entity.Permission> rolePermissions = new java.util.HashSet<>();
                // Assign permissions based on role
                if (roleName == Role.RoleName.ROLE_ADMIN) {
                    rolePermissions.addAll(permissionRepository.findAll());
                } else if (roleName == Role.RoleName.ROLE_SALES) {
                    addPermission(rolePermissions, "READ_CUSTOMERS");
                    addPermission(rolePermissions, "WRITE_CUSTOMERS");
                    addPermission(rolePermissions, "READ_DEALS");
                    addPermission(rolePermissions, "WRITE_DEALS");
                } else if (roleName == Role.RoleName.ROLE_SUPPORT) {
                    addPermission(rolePermissions, "READ_CUSTOMERS");
                    addPermission(rolePermissions, "READ_TICKETS");
                    addPermission(rolePermissions, "WRITE_TICKETS");
                } else if (roleName == Role.RoleName.ROLE_MARKETING) {
                    addPermission(rolePermissions, "READ_CUSTOMERS");
                    addPermission(rolePermissions, "READ_CAMPAIGNS");
                    addPermission(rolePermissions, "WRITE_CAMPAIGNS");
                }

                role.setPermissions(rolePermissions);
                roleRepository.save(role);
                System.out.println("Seeded role: " + roleName);
            }
        }

        // Seed Default Admin
        if (!userRepository.existsByUsername("admin")) {
            com.crm.auth.entity.User admin = new com.crm.auth.entity.User();
            admin.setUsername("admin");
            admin.setEmail("admin@uniq.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");

            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            java.util.Set<Role> roles = new java.util.HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Seeded default admin: admin / admin123");
        }
    }

    private void addPermission(java.util.Set<com.crm.auth.entity.Permission> set, String name) {
        permissionRepository.findByName(name).ifPresent(set::add);
    }
}
