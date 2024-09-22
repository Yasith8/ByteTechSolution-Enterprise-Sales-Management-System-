package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.PowerSupplyEntity;

public interface PowerSupplyDao extends JpaRepository<PowerSupplyEntity,Integer>{
    @Query("select pwr from PowerSupplyEntity pwr where pwr.itemname=?1")
    public PowerSupplyEntity getByPowerSupplyName(String itemname);

    @Query(value = "select concat('PWR',lpad(substring(max(pwr.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.powersupply as pwr",nativeQuery = true)
    public String getNextPowerSupplyNumber();
}
