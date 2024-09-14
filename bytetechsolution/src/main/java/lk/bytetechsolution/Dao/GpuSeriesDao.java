package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.GpuSeriesEntity;

/* 
 * GpuSeriesDao extended from jparepository
 * GpuSeriesDao inherit all the methods provides by  JPARepository for CRUD operations on GpuSeriesEntity
 * Integer spesify the type of primary key in GpuSeriesEntity is Integer
 */
public interface GpuSeriesDao extends JpaRepository<GpuSeriesEntity,Integer>{

    @Query(value = "SELECT * FROM bytetechsolution.gpuseries gs where gs.id in (select chs.gpuseries_id from bytetechsolution.gpuchipset_has_gpuseries chs where chs.gpuchipset_id in (select c.id from bytetechsolution.gpuchipset c where c.name=?1))",nativeQuery = true)
    public List<GpuSeriesEntity> getGPUSeriesByGPUChipset(String chipset);
    
}
