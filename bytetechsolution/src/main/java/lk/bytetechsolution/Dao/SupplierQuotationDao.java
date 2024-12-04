package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.SupplierQuotationEntity;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface SupplierQuotationDao extends JpaRepository<SupplierQuotationEntity,Integer>{

    @Query(value ="select concat('SQC',lpad(substring(max(sqc.quotationid),4)+1,4,'0')) as quotationid from bytetechsolution.supplier_quotation as sqc",nativeQuery = true)
    public String getNextSupplierQuotationNumber();

  
}