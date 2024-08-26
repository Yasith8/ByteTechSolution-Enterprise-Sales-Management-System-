package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CoolerTypeEntity;

/* 
 * CoolerTypeDao extended from jparepository
 * CoolerTypeDao inherit all the methods provides by  JPARepository for CRUD operations on CoolerTypeEntity
 * Integer spesify the type of primary key in CoolerTypeEntity is Integer
 */
public interface CoolerTypeDao extends JpaRepository<CoolerTypeEntity,Integer>{
    
}
