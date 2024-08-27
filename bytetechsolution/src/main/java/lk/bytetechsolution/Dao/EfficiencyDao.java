package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.EfficiencyEntity;

/* 
 * EfficiencyDao extended from jparepository
 * EfficiencyDao inherit all the methods provides by  JPARepository for CRUD operations on EfficiencyEntity
 * Integer spesify the type of primary key in EfficiencyEntity is Integer
 */
public interface EfficiencyDao extends JpaRepository<EfficiencyEntity,Integer>{
    
}
