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
import lk.bytetechsolution.Dao.ProcessorDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.ProcessorEntity;
import lk.bytetechsolution.Entity.UserEntity;
@RestController
public class ProcessorController {
 /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private ProcessorDao daoProcessor;

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

    @RequestMapping(value = "/processor")
    public ModelAndView processorUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView processorView=new ModelAndView();
        //pass the ui
        processorView.setViewName("processor.html");
        //attributes set to show titles in web page using theamleaf
        processorView.addObject("title", "Processor Management || Bytetech Solution");
        processorView.addObject("user", authentication.getName());// passing logged user name
        processorView.addObject("EmpName", loggedEmployee);
        processorView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        processorView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return processorView;

    }
    
    @GetMapping(value = "/processor/alldata", produces ="application/json" ) 
    public List<ProcessorEntity> allProcessorData() {

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"PROCESSOR");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<ProcessorEntity>();
        }


        return daoProcessor.findAll();
    }


    @PostMapping(value = "/processor")
    public String addProcessorData(@RequestBody ProcessorEntity processor){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"PROCESSOR");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //Check any Duplications
        ProcessorEntity extProcessorName=daoProcessor.getByProcessorName(processor.getItemname());

        if(extProcessorName!=null){
            return "Save not Completed : given Name - "+processor.getItemname()+" Already Exist...!";
        }




        try {
            //set AutoGenarated Value
            String nextNumber=daoProcessor.getNextProcessorNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                processor.setItemcode("CPU0004");
            }
            processor.setItemcode(nextNumber);

            //assign added user id
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            //because of security reason only add user id
            processor.setAddeduser(addedUserData.getId());

            //assign added date
            processor.setAddeddate(LocalDateTime.now());

            //assign category
            processor.setCategory_id(daoCategory.getReferenceById(1));
            
            //saving operation
            daoProcessor.save(processor);
            //return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }
    }


    @DeleteMapping(value = "/processor")
    public String deleteProcessorData(@RequestBody ProcessorEntity processor){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"PROCESSOR");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //existance check
        ProcessorEntity extProcessor=daoProcessor.getReferenceById(processor.getId());

        if(extProcessor==null){
            return "Delete not Completed. Processor not existed";
        }
        
        try {

            //assign modify user
            UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
            processor.setDeleteuser(deleteUser.getId());

            //asign modify time
            processor.setDeletedate(LocalDateTime.now());

            //processor status change as soft delete
            processor.setItemstatus_id(daoItemStatus.getReferenceById(3));

            //save operation
            daoProcessor.save(processor);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }


    }


    
    @PutMapping(value = "/processor")
    public String updateProcessorData(@RequestBody ProcessorEntity processor){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "EMPLOYEE");

        if(!userPrivilage.get("update")){
            return "Permission Denied. Update not completed.";
        }

        //existance check
        ProcessorEntity extProcessor=daoProcessor.getReferenceById(processor.getId());

        if(extProcessor==null){
            return "Update not Completed. Processor not existed";
        }
        
        //check duplicate
        ProcessorEntity extProcessorName=daoProcessor.getByProcessorName(processor.getItemname());

        if(extProcessorName==null && extProcessorName.getId()!=processor.getId()){
            return "Update is not Completed : this "+processor.getItemname()+" NIC Number already existed.";
        }
        
        try {

            //assign modify user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            processor.setModifyuser(modifyUser.getId());

            //asign modify time
            processor.setModifydate(LocalDateTime.now());

            //save operation
            daoProcessor.save(processor);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }
    }
}
