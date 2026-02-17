package com.crm.auth.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private java.util.Set<String> permissions;
}
