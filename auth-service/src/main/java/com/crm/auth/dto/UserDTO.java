package com.crm.auth.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String companyName;
    private String companyId;
    private List<String> roles;
    private boolean enabled;
    private Set<String> permissions;

    public UserDTO(Long id, String username, String email, String fullName, String phone,
            String companyName, String companyId, List<String> roles, boolean enabled, Set<String> permissions) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.companyName = companyName;
        this.companyId = companyId;
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
        this.enabled = enabled;
        this.permissions = permissions == null ? new HashSet<>() : new HashSet<>(permissions);
    }

    // Standard getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getCompanyId() {
        return companyId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    // Defensive copy getters for collections
    public List<String> getRoles() {
        return roles == null ? Collections.emptyList() : Collections.unmodifiableList(roles);
    }

    public Set<String> getPermissions() {
        return permissions == null ? Collections.emptySet() : Collections.unmodifiableSet(permissions);
    }

    // Manual setters with defensive copies
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions == null ? new HashSet<>() : new HashSet<>(permissions);
    }
}
