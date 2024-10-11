package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.SupplierStatusDao;
import lk.bytetechsolution.Entity.SupplierStatusEntity;

@RestController
public class SupplierStatusController {
    
    @Autowired
    private SupplierStatusDao dao;


    @GetMapping(value = "/supplierstatus/alldata",produces = "application/json")
    public List<SupplierStatusEntity> GetSupplierStatusData(){
        return dao.findAll();
    }
}
