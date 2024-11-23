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
import lk.bytetechsolution.Dao.MemoryDao;
import lk.bytetechsolution.Dao.UserDao;

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
        memoryView.setViewName("memory.html");
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
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<MemoryEntity>();
        }


        return daoMemory.findAll();
    }

    @GetMapping(value = "/memory/itemlist", produces ="application/json" ) 
    public List<MemoryEntity> MemoryItemList() {

        return daoMemory.memoryItemList();
    }

    @PostMapping(value = "/memory")
    public String addMemoryData(@RequestBody MemoryEntity memory){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //Check any Duplications
        MemoryEntity extMemory=daoMemory.getByMemoryName(memory.getItemname());

        if(extMemory!=null){
            return "Save not Completed : given Name - "+memory.getItemname()+" Already Exist...!";
        }




        try {
            //set AutoGenarated Value
            String nextNumber=daoMemory.getNextMemNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                memory.setItemcode("MEM0001");
            }else{
                memory.setItemcode(nextNumber);
            }

            //assign added user id
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            //because of security reason only add user id
            memory.setAddeduser(addedUserData.getId());

            //assign added date
            memory.setAddeddate(LocalDateTime.now());

            //assign category
            memory.setCategory_id(daoCategory.getReferenceById(3));
            
            //saving operation
            daoMemory.save(memory);
            //return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }
    }


    @DeleteMapping(value = "/memory")
    public String deleteMemoryData(@RequestBody MemoryEntity memory){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //existance check
        MemoryEntity extMemory=daoMemory.getReferenceById(memory.getId());

        if(extMemory==null){
            return "Delete not Completed. Processor not existed";
        }
        
        try {

            //assign modify user
            UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
            memory.setDeleteuser(deleteUser.getId());

            //asign modify time
            memory.setDeletedate(LocalDateTime.now());

            //processor status change as soft delete
            memory.setItemstatus_id(daoItemStatus.getReferenceById(3));

            //save operation
            daoMemory.save(memory);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }


    }

    @PutMapping(value = "/memory")
    public String updateGpuData(@RequestBody MemoryEntity memory){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "ITEM");

        if(!userPrivilage.get("update")){
            return "Permission Denied. Update not completed.";
        }

        //existance check
        MemoryEntity extMemory=daoMemory.getReferenceById(memory.getId());

        if(extMemory==null){
            return "Update not Completed. Processor not existed";
        }
        
        //check duplicategpu
        MemoryEntity extMemoryName=daoMemory.getByMemoryName(memory.getItemname());

        if(extMemoryName==null && extMemory.getId()!=memory.getId()){
            return "Update is not Completed : this "+memory.getItemname()+" Item Name is already existed.";
        }
        
        try {

            //assign modify user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            memory.setModifyuser(modifyUser.getId());

            //asign modify time
            memory.setModifydate(LocalDateTime.now());

            //save operation
            daoMemory.save(memory);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }
    }


}
