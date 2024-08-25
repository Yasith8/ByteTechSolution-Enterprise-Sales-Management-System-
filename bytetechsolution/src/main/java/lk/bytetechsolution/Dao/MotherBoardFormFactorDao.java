package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.MotherBoardFormFactorEntity;

/* 
 * motherboardformfacordao extended from jparepository
 * motherboardformfacordao inherit all the methods provides by  JPARepository for CRUD operations on motherboardformfactorEntity
 * Integer spesify the type of primary key in motherboardformfactorEntity is Integer
 */
public interface MotherBoardFormFactorDao extends JpaRepository<MotherBoardFormFactorEntity,Integer>{
    
}
