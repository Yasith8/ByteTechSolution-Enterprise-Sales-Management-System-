package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import lk.bytetechsolution.Entity.StorageTypeEntity;


/* 
 * StorageTypeDao extended from jparepository
 * StorageTypeDao inherit all the methods provides by  JPARepository for CRUD operations on StorageTypeEntity
 * Integer spesify the type of primary key in StorageTypeEntity is Integer
 */
public interface StorageTypeDao extends JpaRepository<StorageTypeEntity,Integer>{
    
}
