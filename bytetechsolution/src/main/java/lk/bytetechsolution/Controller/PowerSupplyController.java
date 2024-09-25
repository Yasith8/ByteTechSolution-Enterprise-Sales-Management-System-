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
import lk.bytetechsolution.Entity.PowerSupplyEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class PowerSupplyController {
     /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private PowerSupplyDao daoPowerSupply;

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


    @RequestMapping(value = "/powersupply")
    public ModelAndView powerSupplyUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView powerSupplyView=new ModelAndView();
        //pass the ui
        powerSupplyView.setViewName("casing.html");
        //attributes set to show titles in web page using theamleaf
        powerSupplyView.addObject("title", "Power Supply Management || Bytetech Solution");
        powerSupplyView.addObject("user", authentication.getName());// passing logged user name
        powerSupplyView.addObject("EmpName", loggedEmployee);
        powerSupplyView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        powerSupplyView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return powerSupplyView;

    }

    @GetMapping(value = "/powersupply/alldata", produces ="application/json" ) 
    public List<PowerSupplyEntity> allPowerSupplyData() {

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"POWERSUPPLY");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<PowerSupplyEntity>();
        }


        return daoPowerSupply.findAll();
    }

    @PostMapping(value = "/powersupply")
    public String addPowerSupplyData(@RequestBody PowerSupplyEntity powersupply){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"POWERSUPPLY");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //Check any Duplications
        PowerSupplyEntity extPowerSupply=daoPowerSupply.getByPowerSupplyName(powersupply.getItemname());

        if(extPowerSupply!=null){
            return "Save not Completed : given Name - "+powersupply.getItemname()+" Already Exist...!";
        }




        try {
            //set AutoGenarated Value
            String nextNumber=daoPowerSupply.getNextPowerSupplyNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                powersupply.setItemcode("PWR0001");
            }else{
                powersupply.setItemcode(nextNumber);
            }

            //assign added user id
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            //because of security reason only add user id
            powersupply.setAddeduser(addedUserData.getId());

            //assign added date
            powersupply.setAddeddate(LocalDateTime.now());

            //assign category
            powersupply.setCategory_id(daoCategory.getReferenceById(8));
            
            //saving operation
            daoPowerSupply.save(powersupply);
            //return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/powersupply")
    public String deletePowerSupplyData(@RequestBody PowerSupplyEntity powersupply){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"POWERSUPPLY");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //existance check
        PowerSupplyEntity extPowerSupply=daoPowerSupply.getReferenceById(powersupply.getId());

        if(extPowerSupply==null){
            return "Delete not Completed. Processor not existed";
        }
        
        try {

            //assign modify user
            UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
            powersupply.setDeleteuser(deleteUser.getId());

            //asign modify time
            powersupply.setDeletedate(LocalDateTime.now());

            //processor status change as soft delete
            powersupply.setItemstatus_id(daoItemStatus.getReferenceById(3));

            //save operation
            daoPowerSupply.save(powersupply);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }


    }

}
