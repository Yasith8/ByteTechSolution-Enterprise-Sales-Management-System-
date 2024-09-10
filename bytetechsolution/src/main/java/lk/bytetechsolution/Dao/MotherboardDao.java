package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.MotherboardEntity;

public interface MotherboardDao extends JpaRepository<MotherboardEntity,Integer>{

    @Query("select mbr from MotherboardEntity mbr where mbr.itemname=?1")
    MotherboardEntity getByMotherboardName(String itemname);

    @Query(value = "select concat('MBR',lpad(substring(max(mbr.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.motherboard as mbr",nativeQuery = true)
    String getNextMotherboardNumber();
    
}
