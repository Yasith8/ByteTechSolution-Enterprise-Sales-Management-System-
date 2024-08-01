package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.ItemEntity;

public interface ItemDao extends JpaRepository<ItemEntity,Integer>{
    
    /* @Query(value = "SELECT i.itemname FROM ItemEntity i WHERE i.itemname=?")
    public ItemEntity getByItemName(String itemname); */

    @Query(value = "SELECT CONCAT('ITM', LPAD(SUBSTRING(MAX(i.itemcode), 4) + 1, 4, '0')) AS ItemCode FROM bytetechsolution.item AS i",nativeQuery = true)
    public String getNextItemNumber();
}
