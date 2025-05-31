package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.InvoiceEntity;

public interface InvoiceDao extends JpaRepository<InvoiceEntity,Integer>{

     @Query(value = "select concat('INV',lpad(substring(max(inv.invoiceno),4)+1,4,'0')) as invoiceno from bytetechsolution.invoice as inv",nativeQuery = true)
    public String getNextInvoiceCode();
    
}
