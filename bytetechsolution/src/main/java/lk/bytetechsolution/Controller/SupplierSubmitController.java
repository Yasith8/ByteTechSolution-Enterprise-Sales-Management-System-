package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.SupplierDao;
import lk.bytetechsolution.Entity.SupplierEntity;

@RestController
public class SupplierSubmitController {
    @Autowired
    private SupplierDao daoSupplier;

    @GetMapping(value = "/suppliersubmit/supplierbyid",params = {"id"},produces = "application/json")
    public SupplierEntity GetSupplierDataById(@RequestParam("id") Integer id){
        return daoSupplier.findById(id).get();
    }

}
