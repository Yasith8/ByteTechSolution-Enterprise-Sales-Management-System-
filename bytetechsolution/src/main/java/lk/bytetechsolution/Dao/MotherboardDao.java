package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.MotherboardEntity;
import lk.bytetechsolution.Entity.ProcessorEntity;

public interface MotherboardDao extends JpaRepository<MotherboardEntity,Integer>{

    @Query("select mbr from MotherboardEntity mbr where mbr.itemname=?1")
    MotherboardEntity getByMotherboardName(String itemname);

    @Query(value = "select concat('MBR',lpad(substring(max(mbr.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.motherboard as mbr",nativeQuery = true)
    String getNextMotherboardNumber();

    @Query(value="select new MotherboardEntity(m.id,m.itemcode,m.itemname,m.category_id) from MotherboardEntity m where m.brand_id=?1")
    List<MotherboardEntity> motherboardItemList(BrandEntity brandId);
   
    @Query(value="SELECT * FROM bytetechsolution.motherboard mbr WHERE " +"(?1 IS NULL OR mbr.id = ?1) AND " +"(?2 IS NULL OR mbr.itemcode = ?2) AND " +"(?3 IS NULL OR mbr.warranty = ?3) AND " +"(?4 IS NULL OR mbr.maxcapacity = ?4) AND " +"(?5 IS NULL OR mbr.motherboardformfactor_id = ?5) AND " +"(?6 IS NULL OR mbr.motherboardseries_id = ?6) AND " +"(?7 IS NULL OR mbr.motherboardtype_id = ?7) AND " +"(?8 IS NULL OR mbr.cpusocket_id = ?8) AND " +"(?9 IS NULL OR mbr.memorytype_id = ?9) AND"+"(?10 IS NULL OR mbr.interface_id = ?10)AND" +"(?11 IS NULL OR mbr.brand_id = ?11)",nativeQuery=true)
    List<MotherboardEntity> filterItemList(Integer id, String itemcode, Integer warranty, Integer maxcapacity,
            Integer motherboardformfactorId, Integer motherboardseriesId, Integer motherboardtypeId,
            Integer cpusocketId, Integer memorytypeId, Integer interfaceid,Integer brandId);
    
}
