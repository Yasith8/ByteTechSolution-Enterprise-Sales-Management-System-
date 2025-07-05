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

import lk.bytetechsolution.Dao.CustomerDao;
import lk.bytetechsolution.Dao.CustomerStatusDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.CustomerEntity;
import lk.bytetechsolution.Entity.EmployeeEntity;
import lk.bytetechsolution.Entity.InvoiceEntity;
import lk.bytetechsolution.Entity.InvoiceItemEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class CustomerController {
    @Autowired
    private CustomerDao dao;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private CustomerStatusDao daoCustomerStatus;
    
    @Autowired
    private PrivilageController privilageController;


     @Autowired
    private EmployeeDao daoEmployee;

    @RequestMapping(value = "/customer")
    public ModelAndView GetCustomereUI() {
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView customerView = new ModelAndView();
        // pass the ui
        customerView.setViewName("customer.html");
        // attributes set to show titles in web page using theamleaf
        customerView.addObject("title", "Customer Management || Bytetech Solution");
        customerView.addObject("user", authentication.getName());// passing logged user name
        customerView.addObject("EmpName", loggedEmployee);
        customerView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        customerView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return customerView;
    }

    @GetMapping(value = "/customer/alldata", produces = "application/json")
    public List<CustomerEntity> GetGCustomerDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),"CUSTOMER");

        if (!userPrivilage.get("select")) {
            return new ArrayList<CustomerEntity>();
        }

        return dao.findAll();
    }

     @GetMapping(value = "/customer/getallactivecustomers", produces = "application/json")
    public List<CustomerEntity> GetActiveCustomerDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),"CUSTOMER");

        if (!userPrivilage.get("select")) {
            return new ArrayList<CustomerEntity>();
        }

        return dao.getAllActiveCustomers();
    }

    @PostMapping(value = "/customer")
    public String AddCustomer(@RequestBody CustomerEntity customer) {
        // authentiction and autherzation
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "CUSTOMER");

        if (!userPrivilage.get("insert")) {
            return "Permission Denied! Save not Completed";
        }

        try {
            // set AutoGenarated Value
            String nextNumber = dao.getNextCustomerID();

            // if next employee number is not come then set manualy last number+1
            if (nextNumber == null) {
                customer.setCustomerid("CUS0001");
            } else {
                customer.setCustomerid(nextNumber);
            }

            UserEntity addedUserData = daoUser.getByUsername(authentication.getName());
            customer.setAddeduser(addedUserData.getId());

            customer.setAddeddate(LocalDateTime.now());

            dao.save(customer);

            return "OK";

        } catch (Exception e) {
            return "Save not Completed: " + e.getMessage();
        }

    }

     @DeleteMapping(value = "/customer")
   public String DeleteCustomer(@RequestBody CustomerEntity customer){
       //Autherntication and autherization
       Authentication authentication =SecurityContextHolder.getContext().getAuthentication();
       HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "CUSTOMER");
   
       
       if(!userPrivilage.get("delete")){
           return "Permission Denied! Delete not Completed";
       }

       CustomerEntity extCustomer=dao.getReferenceById(customer.getId());
      if(extCustomer==null){
       return "Delete not Completed.Customer not exists";
      }

      try {
       UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
       customer.setDeleteuser(deleteUser.getId());

       customer.setDeletedate(LocalDateTime.now());

       customer.setCustomerstatus_id(daoCustomerStatus.getReferenceById(3));

       dao.save(customer);

       return "OK";
      } catch (Exception e) {
       return "Delete not completed. "+e.getMessage();
      }
   }

    @PutMapping(value = "/customer")
    public String updateCustomer(@RequestBody CustomerEntity customer) {
       
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"CUSTOMER");

        if(!userPrivilage.get("update")){
            return "Permission Denied! Update not Completed";
        }

        CustomerEntity extCustomer=dao.getReferenceById(customer.getId());
        if(extCustomer==null){
         return "Update not Completed.Customer not exists";
        }
      


        try {
            //asign update user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            customer.setModifyuser(modifyUser.getId());

            //assign update date
            customer.setModifydate(LocalDateTime.now());

            //save the data
            dao.save(customer);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed."+e.getMessage();
        }
    }
}
