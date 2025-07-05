package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.PaymentTypeEntity;

public interface PaymentTypeDao extends JpaRepository<PaymentTypeEntity,Integer>{
    
}
