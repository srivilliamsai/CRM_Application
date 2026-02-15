package com.crm.auth.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
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
    private java.util.Set<String> permissions;

    public AuthResponse(String token, Long id, String username, String email, String fullName,
            String companyName, String companyId, List<String> roles, java.util.Set<String> permissions) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.companyName = companyName;
        this.companyId = companyId;
        this.roles = roles;
        this.permissions = permissions;
    }
}
