package com.crm.auth.entity;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@lombok.EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @lombok.EqualsAndHashCode.Include
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 30)
    private RoleName name;

    public enum RoleName {
        ROLE_ADMIN,
        ROLE_SALES,
        ROLE_MARKETING,
        ROLE_SUPPORT,
        ROLE_USER
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "permission_id"))
    private Set<Permission> permissions = new HashSet<>();

    public Role(Long id, RoleName name, Set<Permission> permissions) {
        this.id = id;
        this.name = name;
        this.permissions = permissions == null ? new HashSet<>() : new HashSet<>(permissions);
    }

    // Standard getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RoleName getName() {
        return name;
    }

    public void setName(RoleName name) {
        this.name = name;
    }

    // Defensive copy getter/setter for permissions
    public Set<Permission> getPermissions() {
        return Collections.unmodifiableSet(permissions);
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions == null ? new HashSet<>() : new HashSet<>(permissions);
    }
}
