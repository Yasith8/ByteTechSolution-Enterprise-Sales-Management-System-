package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.SupplierQuotationEntity;

public interface SupplierSubmitDao extends JpaRepository<SupplierQuotationEntity,Integer>{

}