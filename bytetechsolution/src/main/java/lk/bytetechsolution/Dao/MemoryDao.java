package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.MemoryEntity;

public interface MemoryDao extends JpaRepository<MemoryEntity, Integer> {

    @Query(value = "select m from MemoryEntity m where m.itemname=?1")
    public MemoryEntity getByMemoryName(String itemname);

    @Query(value = "select concat('MEM',lpad(substring(max(mem.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.memory as mem",nativeQuery = true)
    public String getNextMemNumber();

    @Query(value="select new MemoryEntity(m.id,m.itemcode,m.itemname,m.category_id) from MemoryEntity m where m.brand_id=?1")
    public List<MemoryEntity> memoryItemList(BrandEntity brandId);

    @Query(value="SELECT * FROM bytetechsolution.memory mem WHERE " +"(?1 IS NULL OR mem.id = ?1) AND " +"(?2 IS NULL OR mem.itemcode = ?2) AND " +"(?3 IS NULL OR mem.warranty = ?3) AND " +"(?4 IS NULL OR mem.speed = ?4) AND " +"(?5 IS NULL OR mem.capacity_id = ?5) AND " +"(?6 IS NULL OR mem.memoryformfactor_id = ?6) AND " +"(?7 IS NULL OR mem.memorytype_id = ?7) AND " +"(?8 IS NULL OR mem.brand_id = ?8)",nativeQuery=true)
    public List<MemoryEntity> filterItemList(Integer id, String itemcode, Integer warranty, Integer speed,
            Integer capacityId, Integer memoryformfactorId, Integer memorytypeId, Integer brandId);

}
