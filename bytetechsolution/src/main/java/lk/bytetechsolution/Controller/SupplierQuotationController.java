package lk.bytetechsolution.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.QuotationStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.GpuEntity;
import lk.bytetechsolution.Entity.SupplierQuotationEntity;

@RestController
public class SupplierQuotationController {
    @Autowired
    private SupplierQuotationEntity daoSupplierQuotation;

     @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private QuotationStatusDao daoQuotationStatus;

    @Autowired
    private PrivilageController privilageController;

    @GetMapping(value = "/supplierquotation/alldata",produces = "application/json")
    public List<SupplierQuotationEntity> getSupplierQuotationData(){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<SupplierQuotationEntity>();
        }


        return daoSupplierQuotation.findAll();
    }
}
