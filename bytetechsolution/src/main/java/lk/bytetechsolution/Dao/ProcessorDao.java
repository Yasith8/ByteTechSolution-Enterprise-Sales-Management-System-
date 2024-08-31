package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.ProcessorEntity;


/* 
 * ProcessorDao extended from jparepository
 * ProcessorDao inherit all the methods provides by  JPARepository for CRUD operations on ProcessorEntity
 * Integer spesify the type of primary key in ProcessorEntity is Integer
 */
public interface ProcessorDao extends JpaRepository<ProcessorEntity,Integer>{


    @Query(value="select p from ProcessorEntity p where p.name=?1")
    public ProcessorEntity getByProcessorName(String itemname);

    @Query(value = "select concat('CPU',lpad(substring(max(p.itemcode),2)+1,4,'0')) as itemcode from bytetechsolution.processor as p",nativeQuery = true)
    public String getNextEmployeeNumber();
    
}
