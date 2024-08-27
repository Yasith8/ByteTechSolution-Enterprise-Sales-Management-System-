package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.MotherboardTypeEntity;

/* 
 * MotherboardTypeDao extended from jparepository
 * MotherboardTypeDao inherit all the methods provides by  JPARepository for CRUD operations on MotherboardTypeEntity
 * Integer spesify the type of primary key in MotherboardTypeEntity is Integer
 */
public interface MotherboardTypeDao extends JpaRepository<MotherboardTypeEntity,Integer>{
    
}
