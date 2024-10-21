package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.PurchaseRequestEntity;

public interface PurchaseRequestDao extends JpaRepository<PurchaseRequestEntity,Integer>{
    
}
