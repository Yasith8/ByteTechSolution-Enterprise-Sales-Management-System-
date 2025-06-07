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
import org.springframework.web.bind.annotation.RequestParam;
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
import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.ProcessorEntity;
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
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<StorageEntity>();
        }


        return daoStorage.findAll();
    }

     @GetMapping(value = "/storage/filteritem", produces = "application/json")
    public List<StorageEntity> allFilterStorageData(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "itemcode", required = false) String itemcode,
            @RequestParam(value = "warranty", required = false) Integer warranty,
            @RequestParam(value = "storageinterface_id", required = false) Integer storageinterfaceId,
            @RequestParam(value = "storagetype_id", required = false) Integer storagetypeId,
            @RequestParam(value = "capacity_id", required = false) Integer capacityId,
            @RequestParam(value = "brand_id", required = false) Integer BrandId
            ) {

        return daoStorage.filterItemList(id, itemcode, warranty,storageinterfaceId,storagetypeId,capacityId,BrandId);
    }

    @GetMapping(value = "/storage/{brandId}/itemlist", produces ="application/json" ) 
    public List<StorageEntity> StorageItemList(@PathVariable("brandId") BrandEntity brandId) {

        return daoStorage.storageItemList(brandId);
    }


    @PostMapping(value = "/storage")
    public String addStorageData(@RequestBody StorageEntity storage){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //Check any Duplications
        StorageEntity extStorage=daoStorage.getByStorageName(storage.getItemname());

        if(extStorage!=null){
            return "Save not Completed : given Name - "+storage.getItemname()+" Already Exist...!";
        }




        try {
            //set AutoGenarated Value
            String nextNumber=daoStorage.getNextStorageNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                storage.setItemcode("STO0001");
            }else{
                storage.setItemcode(nextNumber);
            }

            //assign added user id
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            //because of security reason only add user id
            storage.setAddeduser(addedUserData.getId());

            //assign added date
            storage.setAddeddate(LocalDateTime.now());

            //assign category
            storage.setCategory_id(daoCategory.getReferenceById(5));
            
            //saving operation
            daoStorage.save(storage);
            //return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }
    }


    @DeleteMapping(value = "/storage")
    public String deleteStorageData(@RequestBody StorageEntity storage){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"ITEM");

        //is user have privileges to delete or not
        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //existance check
        StorageEntity extStorage=daoStorage.getReferenceById(storage.getId());

        //see there is any data exist or not
        if(extStorage==null){
            return "Delete not Completed. Processor not existed";
        }
        
        try {

            //assign modify user
            UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
            storage.setDeleteuser(deleteUser.getId());

            //asign modify time
            storage.setDeletedate(LocalDateTime.now());

            //processor status change as soft delete
            storage.setItemstatus_id(daoItemStatus.getReferenceById(3));

            //save operation
            daoStorage.save(storage);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }


    }

    @PutMapping(value = "/storage")
    public String updateStorageData(@RequestBody StorageEntity storage){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "ITEM");

        if(!userPrivilage.get("update")){
            return "Permission Denied. Update not completed.";
        }

        //existance check
        StorageEntity extStorage=daoStorage.getReferenceById(storage.getId());

        if(extStorage==null){
            return "Update not Completed. Processor not existed";
        }
        
        //check duplicategpu
        StorageEntity extStorageName=daoStorage.getByStorageName(storage.getItemname());

        if(extStorage==null && extStorageName.getId()!=storage.getId()){
            return "Update is not Completed : this "+storage.getItemname()+" Item Name is already existed.";
        }
        
        try {

            //assign modify user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            storage.setModifyuser(modifyUser.getId());

            //asign modify time
            storage.setModifydate(LocalDateTime.now());

            //save operation
            daoStorage.save(storage);
            
            return "OK";
        } catch (Exception e) {
            return "Update not Completed : "+e.getMessage();
        }
    }



}
