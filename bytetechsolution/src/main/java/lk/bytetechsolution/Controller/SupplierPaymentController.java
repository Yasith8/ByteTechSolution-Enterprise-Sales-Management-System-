package lk.bytetechsolution.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.SupplierPaymentDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.SupplierPaymentEntity;
import lk.bytetechsolution.Entity.SupplierPaymentHasGRNEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class SupplierPaymentController {
     @Autowired
    private SupplierPaymentDao dao;
    @Autowired
    private UserDao daoUser;


    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private PrivilageController privilageController;


     @RequestMapping(value = "/supplierpayment")
    public ModelAndView GetSupplierPaymentUI() {
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView supplierPaymentView = new ModelAndView();
        // pass the ui
        supplierPaymentView.setViewName("supplierpayment.html");
        // attributes set to show titles in web page using theamleaf
        supplierPaymentView.addObject("title", "Supplier Payment Management || Bytetech Solution");
        supplierPaymentView.addObject("user", authentication.getName());// passing logged user name
        supplierPaymentView.addObject("EmpName", loggedEmployee);
        supplierPaymentView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        supplierPaymentView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return supplierPaymentView;
    }

    @GetMapping(value = "/supplierpayment/alldata", produces = "application/json")
    public List<SupplierPaymentEntity> GetSupplierPaymentDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "SUPPLIERPAYMENT");

        if (!userPrivilage.get("select")) {
            return new ArrayList<SupplierPaymentEntity>();
        }

        return dao.findAll();
    }

    @PostMapping(value = "/supplierpayment")
    public String AddSupplierPayment(@RequestBody SupplierPaymentEntity supplierpayment) {
        // authentiction and autherzation
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "SUPPLIERPAYMENT");

        if (!userPrivilage.get("insert")) {
            return "Permission Denied! Save not Completed";
        }

        try {
            // set AutoGenarated Value
            String nextNumber = dao.getNextSupplierPaymentCode();

            // if next employee number is not come then set manualy last number+1
            if (nextNumber == null) {
                supplierpayment.setPaymentno("SPC0001");
            } else {
                supplierpayment.setPaymentno(nextNumber);
            }

            for (SupplierPaymentHasGRNEntity supplierpaymentgrn : supplierpayment.getSupplier_payment_has_gen()) {
                supplierpaymentgrn.setSupplier_payment_id((supplierpayment));
            }

            dao.save(supplierpayment);

            return "OK";

        } catch (Exception e) {
            return "Save not Completed: " + e.getMessage();
        }

    }

    @DeleteMapping(value = "/supplierpayment")
   public String DeleteInvoice(@RequestBody SupplierPaymentEntity supplierpayment){
       //Autherntication and autherization
       Authentication authentication =SecurityContextHolder.getContext().getAuthentication();
       HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "SUPPLIERPAYMENT");
   
       
       if(!userPrivilage.get("delete")){
           return "Permission Denied! Delete not Completed";
       }

       SupplierPaymentEntity extSupplier=dao.getReferenceById(supplierpayment.getId());
      if(extSupplier==null){
       return "Delete not Completed.Supplier Payment not exists";
      }

      try {

       //invoice.setInvoicestatus_id(daoInvoiceStatus.getReferenceById(3));

       dao.save(supplierpayment);

       return "OK";
      } catch (Exception e) {
       return "Delete not completed. "+e.getMessage();
      }
   }

    @PutMapping(value = "/supplierpayment")
    public String updateInvoice(@RequestBody SupplierPaymentEntity supplierpayment) {
       
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"SUPPLIERPAYMENT");

        if(!userPrivilage.get("update")){
            return "Permission Denied! Update not Completed";
        }

        SupplierPaymentEntity extSupplierPayment=dao.getReferenceById(supplierpayment.getId());
        if(extSupplierPayment==null){
         return "Update not Completed.Invoice not exists";
        }
      


        try {
            for (SupplierPaymentHasGRNEntity supplierpaymentgrn : supplierpayment.getSupplier_payment_has_gen()) {
                supplierpaymentgrn.setSupplier_payment_id((supplierpayment));
            }

            //save the data
            dao.save(supplierpayment);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed."+e.getMessage();
        }
    }

}
