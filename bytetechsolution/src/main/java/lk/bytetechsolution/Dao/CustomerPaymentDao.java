package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.CustomerPaymentEntity;

public interface CustomerPaymentDao extends JpaRepository<CustomerPaymentEntity,Integer>{

    @Query(value = "select concat('CPY',lpad(substring(max(cpy.paymentno),4)+1,4,'0')) as paymentno from bytetechsolution.customer_payment as cpy",nativeQuery = true)
    public String getNextCustomerPaymentCode();
    
}
