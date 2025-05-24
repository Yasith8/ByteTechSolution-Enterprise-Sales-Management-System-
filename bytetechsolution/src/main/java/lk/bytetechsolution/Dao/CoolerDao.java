package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.CoolerEntity;
import lk.bytetechsolution.Entity.ProcessorEntity;

/* 
 * CoolerDao extended from jparepository
 * CoolerDao inherit all the methods provides by  JPARepository for CRUD operations on CoolerEntity
 * Integer spesify the type of primary key in CoolerEntity is Integer
 */
public interface CoolerDao extends JpaRepository<CoolerEntity,Integer>{
    @Query("select clr from CoolerEntity clr where clr.itemname=?1")
    public CoolerEntity getByCoolerName(String itemname);

    @Query(value = "select concat('CLR',lpad(substring(max(clr.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.cooler as clr",nativeQuery = true)
    public String getNextCoolerNumber();

    @Query("select new CoolerEntity(c.id,c.itemcode,c.itemname,c.category_id) from CoolerEntity c where c.brand_id=?1")
    public List<CoolerEntity> coolerItemList(BrandEntity brandId);

     @Query(value="SELECT * FROM bytetechsolution.cooler clr WHERE " +"(?1 IS NULL OR clr.id = ?1) AND " +"(?2 IS NULL OR clr.itemcode = ?2) AND " +"(?3 IS NULL OR clr.warranty = ?3) AND " +"(?4 IS NULL OR clr.cpusocket_id = ?4) AND " +"(?5 IS NULL OR clr.coolertype_id = ?5) AND "  +"(?6 IS NULL OR clr.brand_id = ?6)",nativeQuery=true)
    public List<CoolerEntity> filterItemList(Integer id, String itemcode, Integer warranty,Integer cpusocketId,Integer coolertypeId,Integer brandId);
}
