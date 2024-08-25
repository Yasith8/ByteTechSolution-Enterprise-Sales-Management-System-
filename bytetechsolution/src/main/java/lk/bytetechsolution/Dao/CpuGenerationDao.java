package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CpuGenerationEntity;


/* 
 * cpugenerationDao extended from jparepository
 * cpugenerationDao inherit all the methods provides by  JPARepository for CRUD operations on cpugenerationEntity
 * Integer spesify the type of primary key in cpugenerationEntity is Integer
 */
public interface CpuGenerationDao extends JpaRepository<CpuGenerationEntity,Integer> {
    
}
