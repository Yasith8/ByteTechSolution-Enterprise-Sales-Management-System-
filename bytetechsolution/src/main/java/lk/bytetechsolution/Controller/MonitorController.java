package lk.bytetechsolution.Controller;


import java.util.*;
import java.time.*;

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
/*
* implemented mapping to available for use  
* add implemented mapping to servelet container for use
* fundemental component for build REST full api  (representational state transfer)
* restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.CasingDao;
import lk.bytetechsolution.Dao.CategoryDao;
import lk.bytetechsolution.Dao.CoolerDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Dao.PowerSupplyDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.CasingEntity;
import lk.bytetechsolution.Entity.MonitorEntity;
import lk.bytetechsolution.Entity.PowerSupplyEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class MonitorController {
    /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private MonitorEntity daoMonitor;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private CategoryDao daoCategory;

    @Autowired
    private ItemStatusDao daoItemStatus;

    @Autowired
    private PrivilageController privilageController;


    
    @RequestMapping(value = "/monitor")
    public ModelAndView monitorUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView monitorView=new ModelAndView();
        //pass the ui
        monitorView.setViewName("monitor.html");
        //attributes set to show titles in web page using theamleaf
        monitorView.addObject("title", "Monitor Management || Bytetech Solution");
        monitorView.addObject("user", authentication.getName());// passing logged user name
        monitorView.addObject("EmpName", loggedEmployee);
        monitorView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        monitorView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return monitorView;

    }
}
