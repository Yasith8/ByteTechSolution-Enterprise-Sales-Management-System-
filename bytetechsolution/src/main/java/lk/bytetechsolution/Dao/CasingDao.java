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

    @Query(value="SELECT * FROM bytetechsolution.casing cas WHERE " +"(?1 IS NULL OR cas.id = ?1) AND " +"(?2 IS NULL OR cas.itemcode = ?2) AND " +"(?3 IS NULL OR cas.warranty = ?3) AND " +"(?4 IS NULL OR cas.casematerial_id = ?4) AND " +"(?5 IS NULL OR cas.casecolor_id = ?5) AND " +"(?6 IS NULL OR cas.motherboardformfactor_id = ?6) AND " +"(?7 IS NULL OR cas.cpugeneration_id = ?7) AND " +"(?8 IS NULL OR cas.width = ?8) AND " +"(?9 IS NULL OR cas.depth = ?9) AND"+"(?10 IS NULL OR cas.height = ?10) AND" +"(?11 IS NULL OR cas.brand_id = ?11)",nativeQuery=true)
    public List<CasingEntity> filterItemList(Integer id, String itemcode, Integer warranty, Integer casematerialId,
            Integer casecolorId, Integer motherboardformfactorId, Integer width, Integer depth, Integer height,
            Integer brandId);
}

