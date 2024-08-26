package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.InterfaceEntity;

/* 
 * InterfaceDao extended from jparepository
 * InterfaceDao inherit all the methods provides by  JPARepository for CRUD operations on InterfaceEntity
 * Integer spesify the type of primary key in InterfaceEntity is Integer
 */
public interface InterfaceDao extends JpaRepository<InterfaceEntity,Integer>{

} 