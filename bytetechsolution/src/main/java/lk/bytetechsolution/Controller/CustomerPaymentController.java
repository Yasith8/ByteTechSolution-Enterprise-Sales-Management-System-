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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.CustomerPaymentDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.InvoiceStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.CustomerPaymentEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class CustomerPaymentController {
    @Autowired
    private CustomerPaymentDao daoCustomerPayment;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private InvoiceStatusDao daoInvoiceStatus;

    @Autowired
    private PrivilageController privilageController;

    @RequestMapping(value = "/customerpayment")
    public ModelAndView GetCutomerPaymentUI() {
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView customerPaymentView = new ModelAndView();
        // pass the ui
        customerPaymentView.setViewName("customerpayment.html");
        // attributes set to show titles in web page using theamleaf
        customerPaymentView.addObject("title", "Customer Payment Management || Bytetech Solution");
        customerPaymentView.addObject("user", authentication.getName());// passing logged user name
        customerPaymentView.addObject("EmpName", loggedEmployee);
        customerPaymentView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first
                                                                                                     // role
        customerPaymentView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return customerPaymentView;
    }

    @GetMapping(value = "/customerpayment/alldata", produces = "application/json")
    public List<CustomerPaymentEntity> GetCustomerPaymentDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "CUSTOMERPAYMENT");

        if (!userPrivilage.get("select")) {
            return new ArrayList<CustomerPaymentEntity>();
        }

        return daoCustomerPayment.findAll();
    }

    @PostMapping(value = "/customerpayment")
    public String AddCustomerPayment(@RequestBody CustomerPaymentEntity customerpayment) {
        // authentiction and autherzation
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "CUSTOMERPAYMENT");

        if (!userPrivilage.get("insert")) {
            return "Permission Denied! Save not Completed";
        }

        try {
            // set AutoGenarated Value
            String nextNumber = daoCustomerPayment.getNextCustomerPaymentCode();

            // if next employee number is not come then set manualy last number+1
            if (nextNumber == null) {
                customerpayment.setPaymentno("CPY0001");
            } else {
                customerpayment.setPaymentno(nextNumber);
            }

            UserEntity addedUserData = daoUser.getByUsername(authentication.getName());
            customerpayment.setAddeduser(addedUserData.getId());

            customerpayment.setAddeddate(LocalDateTime.now());

            daoCustomerPayment.save(customerpayment);

            return "OK";

        } catch (Exception e) {
            return "Save not Completed: " + e.getMessage();
        }

    }

    @DeleteMapping(value = "/customerpayment")
    public String DeleteCustomerPayment(@RequestBody CustomerPaymentEntity customerpayment) {
        // Autherntication and autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "CUSTOMERPAYMENT");

        if (!userPrivilage.get("delete")) {
            return "Permission Denied! Delete not Completed";
        }

        CustomerPaymentEntity extCustomerPayment = daoCustomerPayment.getReferenceById(customerpayment.getId());
        if (extCustomerPayment == null) {
            return "Delete not Completed.Customer Payment not exists";
        }

        try {
            UserEntity deleteUser = daoUser.getByUsername(authentication.getName());
            customerpayment.setDeleteuser(deleteUser.getId());

            customerpayment.setDeletedate(LocalDateTime.now());

            customerpayment.setInvoicestatus_id(daoInvoiceStatus.getReferenceById(3));

            daoCustomerPayment.save(customerpayment);

            return "OK";
        } catch (Exception e) {
            return "Delete not completed. " + e.getMessage();
        }
    }

    @PutMapping(value = "/customerpayment")
    public String updateCustomerPayment(@RequestBody CustomerPaymentEntity customerpayment) {

        // Authentication and Autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "CUSTOMERPAYMENT");

        if (!userPrivilage.get("update")) {
            return "Permission Denied! Update not Completed";
        }

        CustomerPaymentEntity extCustomerPayment = daoCustomerPayment.getReferenceById(customerpayment.getId());
        if (extCustomerPayment == null) {
            return "Update not Completed.Customer Payment not exists";
        }

        try {
            // asign update user
            UserEntity modifyUser = daoUser.getByUsername(authentication.getName());
            customerpayment.setModifyuser(modifyUser.getId());

            // assign update date
            customerpayment.setModifydate(LocalDateTime.now());

            // save the data
            daoCustomerPayment.save(customerpayment);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed." + e.getMessage();
        }
    }

}
