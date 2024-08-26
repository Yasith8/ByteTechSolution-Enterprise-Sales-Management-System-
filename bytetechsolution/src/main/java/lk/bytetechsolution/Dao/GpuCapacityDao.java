package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.GpuCapacityEntity;

/* 
 * GpuCapacityDao extended from jparepository
 * GpuCapacityDao inherit all the methods provides by  JPARepository for CRUD operations on GpuCapacityEntity
 * Integer spesify the type of primary key in GpuCapacityEntity is Integer
 */
public interface GpuCapacityDao extends JpaRepository<GpuCapacityEntity,Integer>{
    
}
