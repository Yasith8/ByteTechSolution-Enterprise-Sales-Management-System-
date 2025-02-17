package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CustomerEntity;

public interface CustomerDao extends JpaRepository<CustomerEntity,Integer>{
    
}
