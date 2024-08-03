package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.ItemEntity;
import java.util.*;

public interface ItemDao extends JpaRepository<ItemEntity,Integer>{
    
    /* @Query(value = "SELECT i.itemname FROM ItemEntity i WHERE i.itemname=?")
    public ItemEntity getByItemName(String itemname); */

    /* 
     * LPAD-Left padding values adding
     */
    @Query(value = "SELECT CONCAT('ITM', LPAD(SUBSTRING(MAX(i.itemcode), 4) + 1, 4, '0')) AS ItemCode FROM bytetechsolution.item AS i",nativeQuery = true)
    public String getNextItemNumber();


    /* 
     * for adding selectect columns we use constructor
     */
    @Query("SELECT ItemEntity(i.id,i.itemcode,i.itemname,i.salesprice,i.purchaseprice,i.rop,i.roq,i.quentity,i.photo,i.photoname,i.itemstatus_id,i.category_id,i.brand_id) as itemcode FROM ItemEntity i")
    public List<ItemEntity> findAll();

    
}
