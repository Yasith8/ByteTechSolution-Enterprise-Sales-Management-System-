package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.SupplierDao;
import lk.bytetechsolution.Entity.SupplierEntity;

import java.util.*;

@RestController
public class SupplierController {
    
    @Autowired
    private SupplierDao dao;

    @GetMapping(value = "/supplier",produces = "application/json")
    public List<SupplierEntity> GetAllSupplierData(){
        return dao.findAll();
    }
}
