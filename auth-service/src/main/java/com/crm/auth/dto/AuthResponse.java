package com.crm.auth.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String companyName;
    private String companyId;
    private List<String> roles;
    private Set<String> permissions;

    public AuthResponse(String token, String type, Long id, String username, String email, String fullName,
            String companyName, String companyId, List<String> roles, Set<String> permissions) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.companyName = companyName;
        this.companyId = companyId;
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
        this.permissions = permissions == null ? new HashSet<>() : new HashSet<>(permissions);
    }

    public AuthResponse(String token, Long id, String username, String email, String fullName,
            String companyName, String companyId, List<String> roles, Set<String> permissions) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.companyName = companyName;
        this.companyId = companyId;
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
        this.permissions = permissions == null ? new HashSet<>() : new HashSet<>(permissions);
    }

    // Defensive copy getters
    public String getToken() {
        return token;
    }

    public String getType() {
        return type;
    }

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

    public String getCompanyName() {
        return companyName;
    }

    public String getCompanyId() {
        return companyId;
    }

    public List<String> getRoles() {
        return roles == null ? Collections.emptyList() : Collections.unmodifiableList(roles);
    }

    public Set<String> getPermissions() {
        return permissions == null ? Collections.emptySet() : Collections.unmodifiableSet(permissions);
    }

    // Manual setters with defensive copies
    public void setToken(String token) {
        this.token = token;
    }

    public void setType(String type) {
        this.type = type;
    }

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

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles == null ? new ArrayList<>() : new ArrayList<>(roles);
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions == null ? new HashSet<>() : new HashSet<>(permissions);
    }
}
