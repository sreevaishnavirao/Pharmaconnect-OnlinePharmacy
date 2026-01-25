package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.AppRole;
import com.onlinepharmacy.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(AppRole appRole);
}
