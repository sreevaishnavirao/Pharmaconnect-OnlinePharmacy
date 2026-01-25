package com.onlinepharmacy.backend.repositories;

import com.onlinepharmacy.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
