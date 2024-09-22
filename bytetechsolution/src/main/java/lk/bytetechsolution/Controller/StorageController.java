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
import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Dao.StorageDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.GpuEntity;
import lk.bytetechsolution.Entity.StorageEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class StorageController {
      /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private StorageDao daoStorage;

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


    @RequestMapping(value = "/storage")
    public ModelAndView storageUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView storageView=new ModelAndView();
        //pass the ui
        storageView.setViewName("storage.html");
        //attributes set to show titles in web page using theamleaf
        storageView.addObject("title", "Storage Management || Bytetech Solution");
        storageView.addObject("user", authentication.getName());// passing logged user name
        storageView.addObject("EmpName", loggedEmployee);
        storageView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        storageView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return storageView;

    }

    @GetMapping(value = "/storage/alldata", produces ="application/json" ) 
    public List<StorageEntity> allStorageData() {

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"STORAGE");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<StorageEntity>();
        }


        return daoStorage.findAll();
    }


}
