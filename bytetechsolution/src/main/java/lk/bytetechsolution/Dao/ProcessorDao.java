package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.CpuGenerationEntity;
import lk.bytetechsolution.Entity.CpuSeriesEntity;
import lk.bytetechsolution.Entity.CpuSocketEntity;
import lk.bytetechsolution.Entity.CpuSuffixEntity;
import lk.bytetechsolution.Entity.ProcessorEntity;


/* 
 * ProcessorDao extended from jparepository
 * ProcessorDao inherit all the methods provides by  JPARepository for CRUD operations on ProcessorEntity
 * Integer spesify the type of primary key in ProcessorEntity is Integer
 */
public interface ProcessorDao extends JpaRepository<ProcessorEntity,Integer>{


    @Query("select cpu from ProcessorEntity cpu where cpu.itemname=?1")
    public ProcessorEntity getByProcessorName(String itemname);
    
    @Query(value = "select concat('CPU',lpad(substring(max(cu.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.processor as cu",nativeQuery = true)
    public String getNextProcessorNumber();
    
    @Query(value="select new ProcessorEntity(p.id,p.itemcode,p.itemname,p.category_id,p.brand_id) from ProcessorEntity p where p.brand_id=?1")
    public List<ProcessorEntity> processorItemList(BrandEntity brandId);
    
    
    @Query(value="SELECT * FROM bytetechsolution.processor cpu WHERE " +"(?1 IS NULL OR cpu.id = ?1) AND " +"(?2 IS NULL OR cpu.itemcode = ?2) AND " +"(?3 IS NULL OR cpu.warranty = ?3) AND " +"(?4 IS NULL OR cpu.totalcore = ?4) AND " +"(?5 IS NULL OR cpu.cache = ?5) AND " +"(?6 IS NULL OR cpu.cpuseries_id = ?6) AND " +"(?7 IS NULL OR cpu.cpugeneration_id = ?7) AND " +"(?8 IS NULL OR cpu.cpusocket_id = ?8) AND " +"(?9 IS NULL OR cpu.cpusuffix_id = ?9) AND" +"(?10 IS NULL OR cpu.brand_id = ?10)",nativeQuery=true)
    public List<ProcessorEntity> filterItemList(Integer id, String itemcode, Integer warranty, 
        Integer totalcore, Integer cache, Integer cpuseriesId, Integer cpugenerationId, 
        Integer cpusocketId, Integer cpusuffixId,Integer brandId);
    
}
