package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CustomerStatusEntity;

public interface CustomerStatusDao extends JpaRepository<CustomerStatusEntity,Integer>{
    
}
