package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.CpuSocketEntity;

/* 
 * cpusocketdao extended from jparepository
 * cpusocketdao inherit all the methods provides by  JPARepository for CRUD operations on cpusocketEntity
 * Integer spesify the type of primary key in cpusocketEntity is Integer
 */
public interface CpuSocketDao extends JpaRepository<CpuSocketEntity, Integer> {

    @Query(value = "SELECT * FROM bytetechsolution.cpusocket cs where cs.id in (select shb.cpusocket_id from bytetechsolution.cpusocket_has_brand shb where shb.brand_id in (select b.id from bytetechsolution.brand b where b.name=?1))",nativeQuery = true)
    public List<CpuSocketEntity> getSocketByBrand(String brandname);


    
}
