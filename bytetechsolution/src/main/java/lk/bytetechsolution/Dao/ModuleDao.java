package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.ModuleEntity;


/* 
 * modelueDao extended from jparepository
 * modelueDao inherit all the methods provides by  JPARepository for CRUD operations on EmployeeEntity
 * Integer spesify the type of primary key in moduleEntity is Integer
 */
public interface ModuleDao extends JpaRepository<ModuleEntity,Integer>{

    
}
