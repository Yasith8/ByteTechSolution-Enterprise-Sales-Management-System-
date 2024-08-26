package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.GpuSeriesEntity;

/* 
 * GpuSeriesDao extended from jparepository
 * GpuSeriesDao inherit all the methods provides by  JPARepository for CRUD operations on GpuSeriesEntity
 * Integer spesify the type of primary key in GpuSeriesEntity is Integer
 */
public interface GpuSeriesDao extends JpaRepository<GpuSeriesEntity,Integer>{
    
}
