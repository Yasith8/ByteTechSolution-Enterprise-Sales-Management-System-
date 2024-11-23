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
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.GpuEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class GpuController {
     /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private GpuDao daoGpu;

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

    @RequestMapping(value = "/gpu")
    public ModelAndView gpuUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView gpuView=new ModelAndView();
        //pass the ui
        gpuView.setViewName("gpu.html");
        //attributes set to show titles in web page using theamleaf
        gpuView.addObject("title", "GPU Management || Bytetech Solution");
        gpuView.addObject("user", authentication.getName());// passing logged user name
        gpuView.addObject("EmpName", loggedEmployee);
        gpuView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        gpuView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return gpuView;

    }


    @GetMapping(value = "/gpu/alldata", produces ="application/json" ) 
    public List<GpuEntity> allGpuData() {

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<GpuEntity>();
        }


        return daoGpu.findAll();
    }

    @GetMapping(value = "/gpu/itemlist",produces = "application/json")
    public List<GpuEntity> gpuItemList() {
        return daoGpu.GpuItemList();
    }

    @PostMapping(value = "/gpu")
    public String addGpuData(@RequestBody GpuEntity gpu){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //Check any Duplications
        GpuEntity extGpu=daoGpu.getByGPUName(gpu.getItemname());

        if(extGpu!=null){
            return "Save not Completed : given Name - "+gpu.getItemname()+" Already Exist...!";
        }




        try {
            //set AutoGenarated Value
            String nextNumber=daoGpu.getNextGPUNumber();
            System.out.println(nextNumber);

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                gpu.setItemcode("GPU0001");
            }else{
                gpu.setItemcode(nextNumber);
            }

            //assign added user id
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            //because of security reason only add user id
            gpu.setAddeduser(addedUserData.getId());

            //assign added date
            gpu.setAddeddate(LocalDateTime.now());

            //assign category
            gpu.setCategory_id(daoCategory.getReferenceById(4));
            
            //saving operation
            daoGpu.save(gpu);
            //return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/gpu")
    public String deleteGpuData(@RequestBody GpuEntity gpu){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //existance check
        GpuEntity extGpu=daoGpu.getReferenceById(gpu.getId());

        if(extGpu==null){
            return "Delete not Completed. Processor not existed";
        }
        
        try {

            //assign modify user
            UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
            gpu.setDeleteuser(deleteUser.getId());

            //asign modify time
            gpu.setDeletedate(LocalDateTime.now());

            //processor status change as soft delete
            gpu.setItemstatus_id(daoItemStatus.getReferenceById(3));

            //save operation
            daoGpu.save(gpu);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }


    }

    @PutMapping(value = "/gpu")
    public String updateGpuData(@RequestBody GpuEntity gpu){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "ITEM");

        if(!userPrivilage.get("update")){
            return "Permission Denied. Update not completed.";
        }

        //existance check
        GpuEntity extGPU=daoGpu.getReferenceById(gpu.getId());

        if(extGPU==null){
            return "Update not Completed. Processor not existed";
        }
        
        //check duplicategpu
        GpuEntity extGpuName=daoGpu.getByGPUName(gpu.getItemname());

        if(extGPU==null && extGpuName.getId()!=gpu.getId()){
            return "Update is not Completed : this "+gpu.getItemname()+" Item Name is already existed.";
        }
        
        try {

            //assign modify user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            gpu.setModifyuser(modifyUser.getId());

            //asign modify time
            gpu.setModifydate(LocalDateTime.now());

            //save operation
            daoGpu.save(gpu);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }
    }

    
}
