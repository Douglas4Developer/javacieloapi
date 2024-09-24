package com.apicielo.projeto.repository;

import com.apicielo.projeto.entities.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    Venda findByPaymentId(String paymentId);
}
