package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CpuSocketEntity;

/* 
 * cpusocketdao extended from jparepository
 * cpusocketdao inherit all the methods provides by  JPARepository for CRUD operations on cpusocketEntity
 * Integer spesify the type of primary key in cpusocketEntity is Integer
 */
public interface CpuSocketDao extends JpaRepository<CpuSocketEntity, Integer> {


    
}
