package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.InvoiceStatusDao;
import lk.bytetechsolution.Entity.InvoiceStatusEntity;

@RestController
public class InvoiceStatusController {

    @Autowired
    private InvoiceStatusDao dao;
    
    @GetMapping(value = "/invoicestatus/alldata",produces = "application/json")
    public List<InvoiceStatusEntity> GetInvoiceStatus(){
        return dao.findAll();
    }
}
