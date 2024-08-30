package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.CpuSeriesEntity;

/* 
 * cpuseriesnDao extended from jparepository
 * cpuseriesDao inherit all the methods provides by  JPARepository for CRUD operations on cpuseriesEntity
 * Integer spesify the type of primary key in cpuseriesEntity is Integer
 */
public interface CpuSeriesDao extends JpaRepository<CpuSeriesEntity,Integer>{

 
    @Query(value = "SELECT * FROM bytetechsolution.cpuseries cs where cs.id in (select chb.cpuseries_id from bytetechsolution.cpuseries_has_brand chb where chb.brand_id in (select b.id from bytetechsolution.brand b where b.name=?1))",nativeQuery = true)
    public List<CpuSeriesEntity> getBrandByCategory(String brandname);
    
} 
