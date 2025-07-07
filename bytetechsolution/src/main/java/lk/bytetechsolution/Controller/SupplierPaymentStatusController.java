
package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.SupplierPaymentStatusDao;
import lk.bytetechsolution.Entity.SupplierPaymentStatusEntity;



@RestController
public class SupplierPaymentStatusController {

    @Autowired
    private SupplierPaymentStatusDao dao;
    
    @GetMapping(value = "/supplierpaymentstatus/alldata",produces = "application/json")
    public List<SupplierPaymentStatusEntity> GetSPStatus(){
        return dao.findAll();
    }
}
