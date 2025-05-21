package lk.bytetechsolution.Controller;


import java.util.*;
import java.time.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import lk.bytetechsolution.Dao.MonitorDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.MonitorEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class MonitorController {
    /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private MonitorDao daoMonitor;

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

    @GetMapping(value = "/monitor/alldata", produces ="application/json" ) 
    public List<MonitorEntity> allMonitorData() {

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<MonitorEntity>();
        }


        return daoMonitor.findAll();
    }

    @GetMapping(value = "/monitor/{brandId}/itemlist", produces ="application/json" ) 
    public List<MonitorEntity> MonitorItemList(@PathVariable("brandId") BrandEntity barndId) {
        return daoMonitor.monitorItemList(barndId);
    }



    @PostMapping(value = "/monitor")
    public String addMonitorData(@RequestBody MonitorEntity monitor){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //Check any Duplications
        MonitorEntity extMonitor=daoMonitor.getByMonitorName(monitor.getItemname());

        if(extMonitor!=null){
            return "Save not Completed : given Name - "+monitor.getItemname()+" Already Exist...!";
        }




        try {
            //set AutoGenarated Value
            String nextNumber=daoMonitor.getNextMonitorNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                monitor.setItemcode("MON0001");
            }else{
                monitor.setItemcode(nextNumber);
            }

            //assign added user id
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            //because of security reason only add user id
            monitor.setAddeduser(addedUserData.getId());

            //assign added date
            monitor.setAddeddate(LocalDateTime.now());

            //assign category
            monitor.setCategory_id(daoCategory.getReferenceById(9));
            
            //saving operation
            daoMonitor.save(monitor);
            //return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/monitor")
    public String deleteMonitorData(@RequestBody MonitorEntity monitor){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //existance check
        MonitorEntity extMointor=daoMonitor.getReferenceById(monitor.getId());

        if(extMointor==null){
            return "Delete not Completed. Processor not existed";
        }
        
        try {

            //assign modify user
            UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
            monitor.setDeleteuser(deleteUser.getId());

            //asign modify time
            monitor.setDeletedate(LocalDateTime.now());

            //processor status change as soft delete
            monitor.setItemstatus_id(daoItemStatus.getReferenceById(3));

            //save operation
            daoMonitor.save(monitor);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }


    }

    @PutMapping(value = "/monitor")
    public String updateMonitorData(@RequestBody MonitorEntity monitor){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "ITEM");

        if(!userPrivilage.get("update")){
            return "Permission Denied. Update not completed.";
        }

        //existance check
        MonitorEntity extMonitor=daoMonitor.getReferenceById(monitor.getId());

        if(extMonitor==null){
            return "Update not Completed. Cooler not existed";
        }
        
        //check duplicategpu
        MonitorEntity extMonitorName=daoMonitor.getByMonitorName(monitor.getItemname());

        if(extMonitor==null && extMonitorName.getId()!=monitor.getId()){
            return "Update is not Completed : this "+monitor.getItemname()+" Item Name is already existed.";
        }
        
        try {

            //assign modify user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            monitor.setModifyuser(modifyUser.getId());

            //asign modify time
            monitor.setModifydate(LocalDateTime.now());

            //save operation
            daoMonitor.save(monitor);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }
    }



}
