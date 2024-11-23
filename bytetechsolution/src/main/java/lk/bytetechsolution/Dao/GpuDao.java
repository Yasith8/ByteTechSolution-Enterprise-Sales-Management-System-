package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

    @Query("select new GpuEntity(gpu.id,gpu.itemcode,gpu.itemname,gpu.category_id) from GpuEntity gpu")
    public List<GpuEntity> GpuItemList();
    
    
}
