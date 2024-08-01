package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.ItemEntity;

public interface ItemDao extends JpaRepository<ItemEntity,Integer>{
    
    @Query(value = "SELECT i.itemname FROM ItemEntity i WHERE i.itemname=?")
    public ItemEntity getByItemName(String itemname);

    @Query(value = "select concat('ITM',lpad(substring(max(i.itemcode),2)+1,4,'0')) as ItemCode from bytetechsolution.item as i",nativeQuery = true)
    public String getNextItemNumber();
}
