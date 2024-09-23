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
import lk.bytetechsolution.Dao.CoolerDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.CoolerEntity;
import lk.bytetechsolution.Entity.StorageEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class CoolerController {
      /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private CoolerDao daoCooler;

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

    @RequestMapping(value = "/cooler")
    public ModelAndView coolerUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView coolerView=new ModelAndView();
        //pass the ui
        coolerView.setViewName("cooler.html");
        //attributes set to show titles in web page using theamleaf
        coolerView.addObject("title", "Cooler Management || Bytetech Solution");
        coolerView.addObject("user", authentication.getName());// passing logged user name
        coolerView.addObject("EmpName", loggedEmployee);
        coolerView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        coolerView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return coolerView;

    }

     @GetMapping(value = "/storage/alldata", produces ="application/json" ) 
    public List<CoolerEntity> allCoolerData() {

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"STORAGE");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<CoolerEntity>();
        }


        return daoCooler.findAll();
    }

    @PostMapping(value = "/cooler")
    public String addCoolerData(@RequestBody CoolerEntity cooler){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"COOLER");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //Check any Duplications
        CoolerEntity extCooler=daoCooler.getByCoolerName(cooler.getItemname());

        if(extCooler!=null){
            return "Save not Completed : given Name - "+cooler.getItemname()+" Already Exist...!";
        }




        try {
            //set AutoGenarated Value
            String nextNumber=daoCooler.getNextCoolerNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                cooler.setItemcode("CLR0001");
            }else{
                cooler.setItemcode(nextNumber);
            }

            //assign added user id
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            //because of security reason only add user id
            cooler.setAddeduser(addedUserData.getId());

            //assign added date
            cooler.setAddeddate(LocalDateTime.now());

            //assign category
            cooler.setCategory_id(daoCategory.getReferenceById(6));
            
            //saving operation
            daoCooler.save(cooler);
            //return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/cooler")
    public String deleteCoolerData(@RequestBody CoolerEntity cooler){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"COOLER");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //existance check
        CoolerEntity extCooler=daoCooler.getReferenceById(cooler.getId());

        if(extCooler==null){
            return "Delete not Completed. Processor not existed";
        }
        
        try {

            //assign modify user
            UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
            cooler.setDeleteuser(deleteUser.getId());

            //asign modify time
            cooler.setDeletedate(LocalDateTime.now());

            //processor status change as soft delete
            cooler.setItemstatus_id(daoItemStatus.getReferenceById(3));

            //save operation
            daoCooler.save(cooler);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }


    }

}
