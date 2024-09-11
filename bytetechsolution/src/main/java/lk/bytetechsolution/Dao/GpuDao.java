package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.GpuEntity;
import lk.bytetechsolution.Entity.MotherboardEntity;

/* 
 * GpuDao extended from jparepository
 * GpuDao inherit all the methods provides by  JPARepository for CRUD operations on GpuEntity
 * Integer spesify the type of primary key in GpuEntity is Integer
 */
public interface GpuDao extends JpaRepository<GpuEntity,Integer>{

    @Query("select gpu from GpuEntity gpu where gpu.itemname=?1")
    public String getNextGPUNumber();

    @Query(value = "select concat('GPU',lpad(substring(max(gpu.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.gpu as gpu",nativeQuery = true)
    public GpuEntity getByGPUName(String itemname);
    
}
