package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.MotherboardSeriesEntity;


/* 
 * MotherboardSeriesDao extended from jparepository
 * MotherboardSeriesDao inherit all the methods provides by  JPARepository for CRUD operations on MotherboardSeriesEntity
 * Integer spesify the type of primary key in MotherboardSeriesEntity is Integer
 */
public interface MotherboardSeriesDao extends JpaRepository<MotherboardSeriesEntity,Integer>{
    
}
