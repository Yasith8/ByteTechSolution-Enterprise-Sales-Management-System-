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

import lk.bytetechsolution.Dao.CategoryDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.GpuDao;
import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Dao.MemoryDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.GpuEntity;
import lk.bytetechsolution.Entity.MemoryEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class MemoryController {
     /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private MemoryDao daoMemory;

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

    @RequestMapping(value = "/memory")
    public ModelAndView memoryUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView memoryView=new ModelAndView();
        //pass the ui
        memoryView.setViewName("gpu.html");
        //attributes set to show titles in web page using theamleaf
        memoryView.addObject("title", "Memory Management || Bytetech Solution");
        memoryView.addObject("user", authentication.getName());// passing logged user name
        memoryView.addObject("EmpName", loggedEmployee);
        memoryView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        memoryView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return memoryView;

    }

    @GetMapping(value = "/memory/alldata", produces ="application/json" ) 
    public List<MemoryEntity> allMemoryData() {

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"MEMORY");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<MemoryEntity>();
        }


        return daoMemory.findAll();
    }

}
