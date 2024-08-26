package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.GpuChipsetEntity;

/* 
 * MemoryFormFactorDao extended from jparepository
 * MemoryFormFactorDao inherit all the methods provides by  JPARepository for CRUD operations on MemoryFormFactorEntity
 * Integer spesify the type of primary key in MemoryFormFactorEntity is Integer
 */
public interface GpuChipsetDao extends JpaRepository<GpuChipsetEntity,Integer>{

    
} 
