package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.SupplierPaymentStatusEntity;

public interface SupplierPaymentStatusDao extends JpaRepository<SupplierPaymentStatusEntity,Integer>{
    
}
