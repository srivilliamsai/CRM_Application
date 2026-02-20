package com.crm.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crm.auth.entity.User;
import com.crm.auth.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Override
        @Transactional
        public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
                User user = userRepository.findUserWithRolesAndPermissions(usernameOrEmail)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "User not found with username or email: " + usernameOrEmail));

                return com.crm.auth.security.UserPrincipal.create(user);
        }
}
