package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.SerialNoListDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.SerialNoListEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class SerialNoListController {
    @Autowired
    private SerialNoListDao daoSerialNoList;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @RequestMapping(value = "/inventory")
    public ModelAndView getInventoryUI(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
         //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());
        

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView inventoryView=new ModelAndView();
        //pass the ui
        inventoryView.setViewName("inventory.html");
        //attributes set to show titles in web page using theamleaf
        inventoryView.addObject("title", "Inventory Overview || Bytetech Solution");
        inventoryView.addObject("user", authentication.getName());// passing logged user name
        inventoryView.addObject("EmpName", loggedEmployee);
        inventoryView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        inventoryView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return inventoryView;
    }

    @GetMapping(value = "/inventory/alldata",produces = "application/json")
    public List<SerialNoListEntity> getAllSerialNoList(){
        return daoSerialNoList.findAll();
    }

    @GetMapping(value = "/inventory/availableitem",produces = "application/json")
    public List<SerialNoListEntity> getAvailableSerialNoList(){
        return daoSerialNoList.availableSerialNoList();
    }
}
