package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.EmployeeStatusEntity;

public interface EmployeeStatusDao extends JpaRepository<EmployeeStatusEntity,Integer> {

    
}
