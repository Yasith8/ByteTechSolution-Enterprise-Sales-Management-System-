package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CaseMaterialEntity;

/* 
 * CaseMaterialDao extended from jparepository
 * CaseMaterialDao inherit all the methods provides by  JPARepository for CRUD operations on CaseMaterialEntity
 * Integer spesify the type of primary key in CaseMaterialEntity is Integer
 */
public interface CaseMaterialDao extends JpaRepository<CaseMaterialEntity,Integer>{
    
}
