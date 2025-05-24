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

    @Query(value="SELECT * FROM bytetechsolution.storage sto WHERE " +"(?1 IS NULL OR sto.id = ?1) AND " +"(?2 IS NULL OR sto.itemcode = ?2) AND " +"(?3 IS NULL OR sto.warranty = ?3) AND " +"(?4 IS NULL OR sto.storageinterface_id = ?4) AND " +"(?5 IS NULL OR sto.storagetype_id = ?5) AND " +"(?6 IS NULL OR sto.capacity_id = ?6) AND " +"(?7 IS NULL OR sto.brand_id = ?7) ",nativeQuery=true)
    public List<StorageEntity> filterItemList(Integer id, String itemcode, Integer warranty, Integer storageinterfaceId,
            Integer storagetypeId, Integer capacityId, Integer brandId);
    
}
