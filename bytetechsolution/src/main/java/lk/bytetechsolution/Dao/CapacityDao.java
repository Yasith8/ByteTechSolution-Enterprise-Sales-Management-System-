package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import lk.bytetechsolution.Entity.CapacityEntity;


/* 
 * CapacityDao extended from jparepository
 * CapacityDao inherit all the methods provides by  JPARepository for CRUD operations on CapacityEntity
 * Integer spesify the type of primary key in CapacityEntity is Integer
 */
public interface CapacityDao extends JpaRepository<CapacityEntity,Integer> {
    
}
