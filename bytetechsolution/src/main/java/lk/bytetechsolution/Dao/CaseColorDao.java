package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CaseColorEntity;

/* 
 * CaseColorDao extended from jparepository
 * CaseColorDao inherit all the methods provides by  JPARepository for CRUD operations on CaseColorEntity
 * Integer spesify the type of primary key in CaseColorEntity is Integer
 */
public interface CaseColorDao extends JpaRepository<CaseColorEntity,Integer>{
    
}
