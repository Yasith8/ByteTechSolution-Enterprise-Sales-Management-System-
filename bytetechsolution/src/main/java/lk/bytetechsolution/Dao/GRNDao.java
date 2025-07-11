package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.GRNEntity;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface GRNDao extends JpaRepository<GRNEntity,Integer>{
    @Query(value = "select concat('GRN',lpad(substring(max(grn.grncode),4)+1,4,'0')) as grncode from bytetechsolution.grn as grn",nativeQuery = true)
    String getNextGRNCode();
    
    @Query(value = "SELECT * FROM bytetechsolution.grn as g where g.paidamount!=g.totalamount and g.purchase_request_id in (select pr.id from bytetechsolution.purchase_request as pr where pr.supplier_id=?1)",nativeQuery = true)
    List<GRNEntity> getUnpaidGRN(Integer supplierId);
    
    
    @Query(value = "SELECT * FROM bytetechsolution.grn as g where g.purchase_request_id in (select pr.id from bytetechsolution.purchase_request as pr where pr.supplier_id=?1);",nativeQuery = true)
    List<GRNEntity> getAllGrnBySupplier(Integer supplierId);
    
   
}
