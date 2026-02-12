package com.crm.auth.config;

import com.crm.auth.entity.Role;
import com.crm.auth.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds default roles into the database on first startup.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (!roleRepository.findByName(roleName).isPresent()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
                System.out.println("Seeded role: " + roleName);
            }
        }
    }
}
