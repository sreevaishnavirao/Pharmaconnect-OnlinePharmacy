package com.onlinepharmacy.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.onlinepharmacy.backend.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>{

}
