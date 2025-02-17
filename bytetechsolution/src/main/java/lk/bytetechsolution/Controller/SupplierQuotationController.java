package lk.bytetechsolution.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.QuotationStatusDao;
import lk.bytetechsolution.Dao.SupplierQuotationDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.QuotationItemEntity;
import lk.bytetechsolution.Entity.SupplierQuotationEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class SupplierQuotationController {
    @Autowired
    private SupplierQuotationDao daoSupplierQuotation;

     @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private QuotationStatusDao daoQuotationStatus;

    @Autowired
    private PrivilageController privilageController;

    @GetMapping(value="/suppliersubmitquotation",params = {"quotationreqestid","supplierid"},produces="application/json")
    public ModelAndView getSupplierSubmitQuotationUI(@RequestParam("quotationreqestid") String quotationReqestId,@RequestParam("supplierid") String supplierId){
        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView supplierQuotationView=new ModelAndView();
        //pass the ui
        supplierQuotationView.setViewName("supplierquotationsubmission.html");
        //attributes set to show titles in web page using theamleaf
        supplierQuotationView.addObject("title", "Supplier Quotation Submission || Bytetech Solution");

        return supplierQuotationView;

    }

    

    @RequestMapping(value = "/supplierquotation")
    public ModelAndView supplierQuotationUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView supplierQuotationView=new ModelAndView();
        //pass the ui
        supplierQuotationView.setViewName("supplierquotation.html");
        //attributes set to show titles in web page using theamleaf
        supplierQuotationView.addObject("title", "Supplier Quotation Management || Bytetech Solution");
        supplierQuotationView.addObject("user", authentication.getName());// passing logged user name
        supplierQuotationView.addObject("EmpName", loggedEmployee);
        supplierQuotationView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        supplierQuotationView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return supplierQuotationView;

    }

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

    @PostMapping(value = "/supplierquotation")
    public String addSupplierQuotationData(@RequestBody SupplierQuotationEntity supplierquotation){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //check already existance
        
        try {

            //set AutoGenarated Value
            String nextNumber=daoSupplierQuotation.getNextSupplierQuotationNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                supplierquotation.setQuotationid("SQC0001");
            }else{
                supplierquotation.setQuotationid(nextNumber);
            }

            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            supplierquotation.setAddeduser(addedUserData.getId());

            supplierquotation.setAddeddate(LocalDateTime.now());

            for(QuotationItemEntity quotationItem:supplierquotation.getQuotation_item()){
                quotationItem.setSupplier_quotation_id(supplierquotation);
            }
            daoSupplierQuotation.save(supplierquotation);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed: "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/supplierquotation")
    public String deleteSupplierData(@RequestBody  SupplierQuotationEntity supplierquotation){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

       SupplierQuotationEntity extSupplierQuotation=daoSupplierQuotation.getReferenceById(supplierquotation.getId());
       if(extSupplierQuotation==null){
        return "Delete not Completed.Supplier not exists";
       }

       try {
        UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
        supplierquotation.setDeleteuser(deleteUser.getId());

        supplierquotation.setDeletedate(LocalDateTime.now());

        supplierquotation.setQuotationstatus_id(daoQuotationStatus.getReferenceById(3));

        daoSupplierQuotation.save(supplierquotation);

        return "OK";
       } catch (Exception e) {
        return "Delete not completed. "+e.getMessage();
       }
    }

    @PutMapping(value = "/supplierquotation")
    public String updateSupplierData(@RequestBody SupplierQuotationEntity supplierquotation) {
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");

        if(!userPrivilage.get("update")){
            return "Permission Denied! Update not Completed";
        }

        //check existance
        SupplierQuotationEntity extSupplierQuotation=daoSupplierQuotation.getReferenceById(supplierquotation.getId());

        if(extSupplierQuotation==null){
            return "Delete not Completed.Supplier not exists";
        }

        try {
            //asign update user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            supplierquotation.setModifyuser(modifyUser.getId());

            //assign update date
            supplierquotation.setModifydate(LocalDateTime.now());

            for(QuotationItemEntity quotationItem:supplierquotation.getQuotation_item()){
                quotationItem.setSupplier_quotation_id(supplierquotation);
            }

            //save the data
            daoSupplierQuotation.save(supplierquotation);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed."+e.getMessage();
        }
    }
}
