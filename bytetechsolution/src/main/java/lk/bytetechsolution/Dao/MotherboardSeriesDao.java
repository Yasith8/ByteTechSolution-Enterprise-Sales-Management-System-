package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.MotherboardSeriesEntity;


/* 
 * MotherboardSeriesDao extended from jparepository
 * MotherboardSeriesDao inherit all the methods provides by  JPARepository for CRUD operations on MotherboardSeriesEntity
 * Integer spesify the type of primary key in MotherboardSeriesEntity is Integer
 */
public interface MotherboardSeriesDao extends JpaRepository<MotherboardSeriesEntity,Integer>{

    @Query(value = "SELECT ms.* FROM bytetechsolution.motherboardseries ms where ms.id in (select shs.motherboardseries_id from bytetechsolution.cpusocket_has_motherboardseries shs where shs.cpusocket_id in (select cs.id from bytetechsolution.cpusocket cs where cs.name=?1))",nativeQuery = true)
    public List<MotherboardSeriesEntity> getMotherboardSeriesBySocket(String socketname);
    
}
