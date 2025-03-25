package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.CpuSocketEntity;
import lk.bytetechsolution.Entity.CpuSuffixEntity;

/* 
 * cpusocketdao extended from jparepository
 * cpusocketdao inherit all the methods provides by  JPARepository for CRUD operations on cpusocketEntity
 * Integer spesify the type of primary key in cpusocketEntity is Integer
 */
public interface CpuSuffixDao extends JpaRepository<CpuSuffixEntity, Integer> {

    @Query(value = "SELECT * FROM bytetechsolution.cpusuffix cs where cs.id in (select shb.cpusuffix_id from bytetechsolution.cpusuffix_has_brand shb where shb.brand_id in (select b.id from bytetechsolution.brand b where b.name=?1))",nativeQuery = true)
    public List<CpuSuffixEntity> getSuffixByBrand(String brandname);
    
    @Query(value = "SELECT * FROM bytetechsolution.cpusuffix cs where cs.id in (select shs.cpusuffix_id from bytetechsolution.cpuseries_has_cpusuffix shs where shs.cpuseries_id in (select cs.id from bytetechsolution.cpuseries cs where cs.name=?1))",nativeQuery = true)
    public List<CpuSocketEntity> getSuffixBySeries(String seriesname);

 
}
