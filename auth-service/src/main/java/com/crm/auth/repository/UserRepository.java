package com.crm.auth.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.auth.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    List<User> findByCompanyName(String companyName);

    List<User> findByCompanyId(String companyId);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u LEFT JOIN FETCH u.roles r LEFT JOIN FETCH r.permissions WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findUserWithRolesAndPermissions(
            @org.springframework.data.repository.query.Param("usernameOrEmail") String usernameOrEmail);
}
