package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.CoolerEntity;

/* 
 * CoolerDao extended from jparepository
 * CoolerDao inherit all the methods provides by  JPARepository for CRUD operations on CoolerEntity
 * Integer spesify the type of primary key in CoolerEntity is Integer
 */
public interface CoolerDao extends JpaRepository<CoolerEntity,Integer>{
    @Query("select clr from CoolerEntity clr where clr.itemname=?1")
    public CoolerEntity getByCoolerName(String itemname);

    @Query(value = "select concat('CLR',lpad(substring(max(clr.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.cooler as clr",nativeQuery = true)
    public String getNextCoolerNumber();

    @Query("select new CoolerEntity(c.id,c.itemcode,c.itemname,c.category_id) from CoolerEntity c")
    public List<CoolerEntity> coolerItemList();
}
