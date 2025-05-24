package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.GpuEntity;

/* 
 * GpuDao extended from jparepository
 * GpuDao inherit all the methods provides by  JPARepository for CRUD operations on GpuEntity
 * Integer spesify the type of primary key in GpuEntity is Integer
 */
public interface GpuDao extends JpaRepository<GpuEntity,Integer>{

    @Query("select gpu from GpuEntity gpu where gpu.itemname=?1")
    public GpuEntity getByGPUName(String itemname);
    
    @Query(value = "select concat('GPU',lpad(substring(max(gpu.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.gpu as gpu",nativeQuery = true)
    public String getNextGPUNumber();

    @Query("select new GpuEntity(gpu.id,gpu.itemcode,gpu.itemname,gpu.category_id) from GpuEntity gpu where gpu.brand_id=?1")
    public List<GpuEntity> GpuItemList(BrandEntity brandId);

    @Query(value="SELECT * FROM bytetechsolution.gpu cpu WHERE " +"(?1 IS NULL OR cpu.id = ?1) AND " +"(?2 IS NULL OR cpu.itemcode = ?2) AND " +"(?3 IS NULL OR cpu.warranty = ?3) AND " +"(?4 IS NULL OR cpu.motherboardformfactor_id = ?4) AND " +"(?5 IS NULL OR cpu.interface_id = ?5) AND " +"(?6 IS NULL OR cpu.gpuchipset_id = ?6) AND " +"(?7 IS NULL OR cpu.gpuseries_id = ?7) AND " +"(?8 IS NULL OR cpu.gputype_id = ?8) AND " +"(?9 IS NULL OR cpu.capacity_id = ?9) AND" +"(?10 IS NULL OR cpu.brand_id = ?10)",nativeQuery=true)
    public List<GpuEntity> filterItemList(Integer id, String itemcode, Integer warranty,
            Integer motherboardformfactorId, Integer interfaceId, Integer gpuchipsetId, Integer gpuseriesId,
            Integer gputypeId, Integer capacityId, Integer brandId);
    
    
}
