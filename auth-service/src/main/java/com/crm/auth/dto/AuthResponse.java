package com.crm.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

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

    public AuthResponse(String token, Long id, String username, String email, String fullName,
            String companyName, String companyId, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.companyName = companyName;
        this.companyId = companyId;
        this.roles = roles;
    }
}
