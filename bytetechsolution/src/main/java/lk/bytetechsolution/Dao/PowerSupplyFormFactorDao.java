package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.PowerSupplyFormFactorEntity;

/* 
 * PowerSupplyFormFactorDao extended from jparepository
 * PowerSupplyFormFactorDao inherit all the methods provides by  JPARepository for CRUD operations on PowerSupplyFormFactorEntity
 * Integer spesify the type of primary key in PowerSupplyFormFactorEntity is Integer
 */
public interface PowerSupplyFormFactorDao extends JpaRepository<PowerSupplyFormFactorEntity,Integer>{
    
}
