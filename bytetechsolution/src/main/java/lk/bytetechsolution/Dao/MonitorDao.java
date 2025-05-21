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
}
