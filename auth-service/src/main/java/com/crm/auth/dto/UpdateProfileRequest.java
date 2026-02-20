package com.crm.auth.dto;

import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    @Size(max = 100)
    private String fullName;

    @Size(max = 20)
    private String phone;

    // We can add more fields here later if needed (e.g. avatarUrl, specific
    // preferences)
}
