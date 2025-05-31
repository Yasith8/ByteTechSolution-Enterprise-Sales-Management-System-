package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.CustomerEntity;

public interface CustomerDao extends JpaRepository<CustomerEntity, Integer> {

    @Query(value = "select concat('CUS',lpad(substring(max(cus.customerid),4)+1,4,'0')) as customerid from bytetechsolution.customer as cus", nativeQuery = true)
    public String getNextCustomerID();

}
