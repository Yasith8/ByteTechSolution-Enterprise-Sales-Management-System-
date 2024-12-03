package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.QuotationItemEntity;

public interface QuotationItemDao extends JpaRepository<QuotationItemEntity,Integer>{
    
}
