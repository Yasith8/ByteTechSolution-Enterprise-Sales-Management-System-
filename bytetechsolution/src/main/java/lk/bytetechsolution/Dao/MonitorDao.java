package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.MonitorEntity;

public interface MonitorDao extends JpaRepository<MonitorEntity,Integer>{
     @Query(value = "select m from MonitorEntity m where m.itemname=?1")
    public MonitorEntity getByMonitorName(String itemname);

    @Query(value = "select concat('MON',lpad(substring(max(mON.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.monitor as mon",nativeQuery = true)
    public String getNextMonitorNumber();

    @Query(value="select new MonitorEntity(m.id,m.itemcode,m.itemname,m.category_id) from MemoryEntity m where m.brand_id=?1")
    public List<MonitorEntity> monitorItemList(BrandEntity barndId);

    @Query(value="SELECT * FROM bytetechsolution.monitor mon WHERE " +"(?1 IS NULL OR mon.id = ?1) AND " +"(?2 IS NULL OR mon.itemcode = ?2) AND " +"(?3 IS NULL OR mon.warranty = ?3) AND " +"(?4 IS NULL OR mon.screensize = ?4) AND " +"(?5 IS NULL OR mon.resolution = ?5) AND " +"(?6 IS NULL OR mon.refreshrate = ?6) AND " +"(?7 IS NULL OR mon.aspectratio = ?7) AND " +"(?8 IS NULL OR mon.panaltype_id = ?8) AND " +"(?9 IS NULL OR mon.brand_id = ?9)",nativeQuery=true)
    public List<MonitorEntity> filterItemList(Integer id, String itemcode, Integer warranty, Integer screensize,
            Integer resolution, Integer refreshrate, Integer aspectratio, Integer panaltypeId, Integer brandId);
}
