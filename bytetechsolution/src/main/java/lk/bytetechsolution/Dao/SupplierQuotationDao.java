package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.SupplierQuotationEntity;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface SupplierQuotationDao extends JpaRepository<SupplierQuotationEntity,Integer>{

  
}