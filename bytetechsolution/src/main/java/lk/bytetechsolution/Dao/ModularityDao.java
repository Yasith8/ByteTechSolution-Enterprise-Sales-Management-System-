package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.ModularityEntity;


/* 
 * ModularityDao extended from jparepository
 * ModularityDao inherit all the methods provides by  JPARepository for CRUD operations on ModularityEntity
 * Integer spesify the type of primary key in ModularityEntity is Integer
 */
public interface ModularityDao extends JpaRepository<ModularityEntity,Integer>{
    
}
