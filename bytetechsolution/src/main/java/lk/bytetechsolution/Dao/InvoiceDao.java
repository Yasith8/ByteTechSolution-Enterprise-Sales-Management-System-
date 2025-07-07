package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.InvoiceEntity;

public interface InvoiceDao extends JpaRepository<InvoiceEntity,Integer>{

     @Query(value = "select concat('INV',lpad(substring(max(inv.invoiceno),4)+1,4,'0')) as invoiceno from bytetechsolution.invoice as inv",nativeQuery = true)
     public String getNextInvoiceCode();
     
     @Query(value = "select * from bytetechsolution.invoice as inv where inv.customer_id=?1 and inv.invoicestatus_id='2'",nativeQuery = true)
     public List<InvoiceEntity> findInvoicesByCustomer(Integer customerId);
    
}
