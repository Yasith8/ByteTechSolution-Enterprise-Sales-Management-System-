package lk.bytetechsolution.Dao;

import java.time.LocalDate;
import java.util.List;

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

   @Query(value = "SELECT * FROM bytetechsolution.supplier_quotation sq WHERE sq.validdate >= ?2 AND sq.supplier_id = ?1", nativeQuery = true)
   public List<SupplierQuotationEntity> findByAfterValiddate(Integer supplierId, String validdate);
   
   @Query(value = "SELECT * FROM bytetechsolution.supplier_quotation as sq where sq.supplier_id=?1 order by id desc", nativeQuery = true)
   public List<SupplierQuotationEntity> getSQsBySypplier(Integer supplierId);
   }