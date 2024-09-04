package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.MotherboardTypeEntity;

/* 
 * MotherboardTypeDao extended from jparepository
 * MotherboardTypeDao inherit all the methods provides by  JPARepository for CRUD operations on MotherboardTypeEntity
 * Integer spesify the type of primary key in MotherboardTypeEntity is Integer
 */
public interface MotherboardTypeDao extends JpaRepository<MotherboardTypeEntity,Integer>{

    @Query(value = "SELECT mt.* FROM bytetechsolution.motherboardtype mt where mt.id in (select sht.motherboardtype_id from bytetechsolution.motherboardseries_has_motherboardtype sht where sht.motherboardseries_id in (select ms.id from bytetechsolution.motherboardseries ms where ms.name=?1))",nativeQuery = true)
    public List<MotherboardTypeEntity> getMotherboardTypeBySeries(String seriesname);
    
}
