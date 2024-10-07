package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.SupplierDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.SupplierEntity;
import lk.bytetechsolution.Entity.UserEntity;

import java.util.*;

@RestController
public class SupplierController {
    
    @Autowired
    private SupplierDao daoSupplier;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private PrivilageController privilageController;


    @RequestMapping(value = "/supplier")
    public ModelAndView getSupplierUI(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
         //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView supplierView=new ModelAndView();
        //pass the ui
        supplierView.setViewName("supplier.html");
        //attributes set to show titles in web page using theamleaf
        supplierView.addObject("title", "Supplier Management || Bytetech Solution");
        supplierView.addObject("user", authentication.getName());// passing logged user name
        supplierView.addObject("EmpName", loggedEmployee);
        supplierView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        supplierView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return supplierView;
    }

    @GetMapping(value = "/supplier/alldata",produces = "application/json")
    public List<SupplierEntity> GetAllSupplierData(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"SUPPLIER");

        if(!userPrivilage.get("select")){
            return new ArrayList<SupplierEntity>();
        }

        return daoSupplier.findAll();
    }
}
