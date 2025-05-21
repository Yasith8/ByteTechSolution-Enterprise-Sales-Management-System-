package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
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

    
    @Query(value="select new StorageEntity(s.id,s.itemcode,s.itemname,s.category_id) from StorageEntity s where s.brand_id=?1")
    public List<StorageEntity> storageItemList(BrandEntity brandId);
    
}
