package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.CasingEntity;
/* 
 * CasingDao extended from jparepository
 * CasingDao inherit all the methods provides by  JPARepository for CRUD operations on CasingEntity
 * Integer spesify the type of primary key in CasingEntity is Integer
 */
public interface CasingDao extends JpaRepository<CasingEntity,Integer>{
     @Query("select cas from CasingEntity cas where cas.itemname=?1")
    public CasingEntity getByCaseName(String itemname);

    @Query(value = "select concat('CAS',lpad(substring(max(cas.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.casing as cas",nativeQuery = true)
    public String getNextCaseNumber();

    @Query(value="select new CasingEntity(c.id,c.itemcode,c.itemname,c.category_id) from CasingEntity c where c.brand_id=?1")
    public List<CasingEntity> CasingItemList(BrandEntity brandId);
}

