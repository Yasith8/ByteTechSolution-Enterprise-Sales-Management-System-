package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.StorageEntity;



/* 
 * StorageDao extended from jparepository
 * StorageDao inherit all the methods provides by  JPARepository for CRUD operations on StorageEntity
 * Integer spesify the type of primary key in StorageEntity is Integer
 */
public interface StorageDao extends JpaRepository<StorageEntity,Integer>{
    @Query("select sto from StorageEntity sto where sto.itemname=?1")
    public StorageEntity getByStorageName(String itemname);

    @Query(value = "select concat('STO',lpad(substring(max(sto.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.storage as sto",nativeQuery = true)
    public String getNextStorageNumber();
    
}
