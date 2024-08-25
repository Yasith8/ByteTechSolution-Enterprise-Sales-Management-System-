package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CpuSeriesEntity;

/* 
 * cpuseriesnDao extended from jparepository
 * cpuseriesDao inherit all the methods provides by  JPARepository for CRUD operations on cpuseriesEntity
 * Integer spesify the type of primary key in cpuseriesEntity is Integer
 */
public interface CpuSeriesDao extends JpaRepository<CpuSeriesEntity,Integer>{
    
} 
