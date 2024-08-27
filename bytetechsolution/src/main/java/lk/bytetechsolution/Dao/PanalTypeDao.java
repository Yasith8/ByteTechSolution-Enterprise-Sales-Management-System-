package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.PanalTypeEntity;


/* 
 * PanalTypeDao extended from jparepository
 * PanalTypeDao inherit all the methods provides by  JPARepository for CRUD operations on PanalTypeEntity
 * Integer spesify the type of primary key in PanalTypeEntity is Integer
 */
public interface PanalTypeDao extends JpaRepository<PanalTypeEntity,Integer>{
    
}
