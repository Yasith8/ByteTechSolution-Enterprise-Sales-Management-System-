package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.GpuTypeEntity;


/* 
 * GpuTypeDao extended from jparepository
 * GpuTypeDao inherit all the methods provides by  JPARepository for CRUD operations on GpuTypeEntity
 * Integer spesify the type of primary key in GpuTypeEntity is Integer
 */
public interface GpuTypeDao extends JpaRepository<GpuTypeEntity,Integer>{
    
}
