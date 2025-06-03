package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.SupplierPaymentEntity;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface SupplierPaymentDao extends JpaRepository<SupplierPaymentEntity,Integer>{

    @Query(value = "select concat('SPC',lpad(substring(max(spy.paymentno),4)+1,4,'0')) as paymentno from bytetechsolution.supplier as spy",nativeQuery = true)
    public String getNextSupplierPaymentCode();
    
}
