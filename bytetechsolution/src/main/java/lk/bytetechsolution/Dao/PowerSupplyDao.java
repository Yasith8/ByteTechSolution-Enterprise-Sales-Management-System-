package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.PowerSupplyEntity;

public interface PowerSupplyDao extends JpaRepository<PowerSupplyEntity,Integer>{
    @Query("select pwr from PowerSupplyEntity pwr where pwr.itemname=?1")
    public PowerSupplyEntity getByPowerSupplyName(String itemname);

    @Query(value = "select concat('PWR',lpad(substring(max(pwr.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.powersupply as pwr",nativeQuery = true)
    public String getNextPowerSupplyNumber();

    @Query(value="select new PowerSupplyEntity(p.id,p.itemcode,p.itemname,p.category_id) from PowerSupplyEntity p where p.brand_id=?1")
    public List<PowerSupplyEntity> powersupplyItemList(BrandEntity brandId);

    @Query(value="SELECT * FROM bytetechsolution.powersupply pwr WHERE " +"(?1 IS NULL OR pwr.id = ?1) AND " +"(?2 IS NULL OR pwr.itemcode = ?2) AND " +"(?3 IS NULL OR pwr.wattage = ?3) AND " +"(?4 IS NULL OR pwr.efficiency_id = ?4) AND " +"(?5 IS NULL OR pwr.modularity_id = ?5) AND " +"(?6 IS NULL OR pwr.powersupplyformfactor_id = ?6) AND " +"(?7 IS NULL OR pwr.warranty = ?7) AND " +"(?8 IS NULL OR pwr.brand_id = ?8)",nativeQuery=true)
    public List<PowerSupplyEntity> filterItemList(Integer id, String itemcode, Integer wattage, Integer efficiencyId,
            Integer modulerityId, Integer powersupplyformfactorID, Integer warranty, Integer brandId);
}