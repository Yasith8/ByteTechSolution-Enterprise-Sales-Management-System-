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
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.CasingEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class CasingController {
      /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private CasingDao daoCasing;

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

    @RequestMapping(value = "/casing")
    public ModelAndView casingUI(){
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
        coolerView.setViewName("casing.html");
        //attributes set to show titles in web page using theamleaf
        coolerView.addObject("title", "Casing Management || Bytetech Solution");
        coolerView.addObject("user", authentication.getName());// passing logged user name
        coolerView.addObject("EmpName", loggedEmployee);
        coolerView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        coolerView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return coolerView;

    }

     @GetMapping(value = "/casing/alldata", produces ="application/json" ) 
    public List<CasingEntity> allCasingData() {

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"CASING");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<CasingEntity>();
        }


        return daoCasing.findAll();
    }

    @PostMapping(value = "/casing")
    public String addCasingData(@RequestBody CasingEntity casing){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"CASING");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //Check any Duplications
        CasingEntity extCasing=daoCasing.getByCaseName(casing.getItemname());

        if(extCasing!=null){
            return "Save not Completed : given Name - "+casing.getItemname()+" Already Exist...!";
        }




        try {
            //set AutoGenarated Value
            String nextNumber=daoCasing.getNextCaseNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                casing.setItemcode("CAS0001");
            }else{
                casing.setItemcode(nextNumber);
            }

            //assign added user id
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            //because of security reason only add user id
            casing.setAddeduser(addedUserData.getId());

            //assign added date
            casing.setAddeddate(LocalDateTime.now());

            //assign category
            casing.setCategory_id(daoCategory.getReferenceById(7));
            
            //saving operation
            daoCasing.save(casing);
            //return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/casing")
    public String deleteCasingData(@RequestBody CasingEntity casing){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"CASING");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //existance check
        CasingEntity extCase=daoCasing.getReferenceById(casing.getId());

        if(extCase==null){
            return "Delete not Completed. Processor not existed";
        }
        
        try {

            //assign modify user
            UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
            casing.setDeleteuser(deleteUser.getId());

            //asign modify time
            casing.setDeletedate(LocalDateTime.now());

            //processor status change as soft delete
            casing.setItemstatus_id(daoItemStatus.getReferenceById(3));

            //save operation
            daoCasing.save(casing);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }


    }


    @PutMapping(value = "/casing")
    public String updateCasingData(@RequestBody CasingEntity casing){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "CASING");

        if(!userPrivilage.get("update")){
            return "Permission Denied. Update not completed.";
        }

        //existance check
        CasingEntity extCase=daoCasing.getReferenceById(casing.getId());

        if(extCase==null){
            return "Update not Completed. Cooler not existed";
        }
        
        //check duplicategpu
        CasingEntity extCaseName=daoCasing.getByCaseName(casing.getItemname());

        if(extCase==null && extCaseName.getId()!=casing.getId()){
            return "Update is not Completed : this "+casing.getItemname()+" Item Name is already existed.";
        }
        
        try {

            //assign modify user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            casing.setModifyuser(modifyUser.getId());

            //asign modify time
            casing.setModifydate(LocalDateTime.now());

            //save operation
            daoCasing.save(casing);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }
    }
  


}
