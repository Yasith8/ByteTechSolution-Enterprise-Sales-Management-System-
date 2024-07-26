package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import lk.bytetechsolution.Dao.BrandDao;
import lk.bytetechsolution.Entity.BrandEntity;

import org.springframework.web.bind.annotation.GetMapping;



@RestController
public class BrandController {
    
    @Autowired
    private BrandDao dao;


    @GetMapping(value = "/brand/alldata",produces = "application/json")
    public List<BrandEntity> getBrandData() {
        return dao.findAll();
    }
    
}
