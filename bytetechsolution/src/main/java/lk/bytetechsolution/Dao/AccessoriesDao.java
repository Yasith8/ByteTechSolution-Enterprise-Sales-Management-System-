package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.AccessoriesEntity;
import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.ProcessorEntity;

public interface AccessoriesDao extends JpaRepository<AccessoriesEntity,Integer>{

   @Query("select acc from AccessoriesEntity acc where acc.itemname=?1")
    public AccessoriesEntity getByAccessoriesName(String itemname);
    
    @Query(value = "select concat('ACS',lpad(substring(max(acs.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.accessories as acs",nativeQuery = true)
    public String getNextAccessoriesNumber();

   @Query(value="SELECT * FROM bytetechsolution.accessories as acc WHERE " +"(?1 IS NULL OR acc.id = ?1) AND " +"(?2 IS NULL OR acc.itemcode = ?2) AND " +"(?3 IS NULL OR acc.warranty = ?3) AND " +"(?4 IS NULL OR acc.brand_id = ?4)",nativeQuery=true)
   public List<AccessoriesEntity> filterItemList(Integer id, String itemcode, Integer warranty, Integer brandId);

   @Query(value="select new AccessoriesEntity(a.id,a.itemcode,a.itemname,a.category_id,a.brand_id) from AccessoriesEntity a where a.brand_id=?1")
   public List<AccessoriesEntity> accessoriesItemList(BrandEntity brandId);

    
}
