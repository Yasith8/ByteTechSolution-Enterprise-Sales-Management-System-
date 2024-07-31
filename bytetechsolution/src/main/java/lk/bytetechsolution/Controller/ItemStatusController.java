package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Entity.ItemStatusEntity;

import java.util.*;

@RestController
public class ItemStatusController {
    
    @Autowired
    private ItemStatusDao dao;


    @GetMapping(value = "/itemstatus/alldata")
    public List<ItemStatusEntity> allItemStatusData(){
        return dao.findAll();
    }
}
