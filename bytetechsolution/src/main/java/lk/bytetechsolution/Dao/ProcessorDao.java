package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.ProcessorEntity;


/* 
 * ProcessorDao extended from jparepository
 * ProcessorDao inherit all the methods provides by  JPARepository for CRUD operations on ProcessorEntity
 * Integer spesify the type of primary key in ProcessorEntity is Integer
 */
public interface ProcessorDao extends JpaRepository<ProcessorEntity,Integer>{
    
}
