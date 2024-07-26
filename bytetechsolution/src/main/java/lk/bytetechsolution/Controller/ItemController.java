package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.ItemDao;
import lk.bytetechsolution.Entity.ItemEntity;

import java.util.*;

@RestController
public class ItemController {
    
    @Autowired
    private ItemDao dao;


    @GetMapping(value = "/item/alldata",produces = "application/json")
    public List<ItemEntity> getItemData(){
        return dao.findAll();
    }
}
