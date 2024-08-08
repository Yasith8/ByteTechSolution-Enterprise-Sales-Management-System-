package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.ItemDao;
import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.ItemEntity;
import lk.bytetechsolution.Entity.ItemStatusEntity;
import lk.bytetechsolution.Entity.UserEntity;


import java.time.LocalDateTime;
import java.util.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
public class ItemController {
    
    @Autowired
    private ItemDao dao;

    @Autowired
    private ItemStatusDao daoStatus;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private PrivilageController privilageController;


    @RequestMapping(value = "/item") 
    public ModelAndView ItemUI(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

          //get looged user object
          UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

          //get Logged user Employee data
          String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        ModelAndView itemView=new ModelAndView();
        itemView.addObject("title", "Item Management || ByteTech Solution");
        itemView.addObject("user", authentication.getName());
        itemView.addObject("EmpName", loggedEmployee);
        itemView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        itemView.addObject("LoggedUserPhoto", loggedUser.getPhoto());
        itemView.setViewName("item.html");
        return itemView;
    }

    @GetMapping(value = "/item/alldata",produces = "application/json")
    public List<ItemEntity> getItemData(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "ITEM");

        if(!userPrivilage.get("select")){
            return new ArrayList<ItemEntity>();
        }
        return dao.findAll();
        
    }

    @PostMapping(value = "item")
    public String AddItem(@RequestBody ItemEntity item) {
    
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        //get user privilages according to logged user
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "ITEM");

        if(!userPrivilage.get("insert")){
            return "Access Denied. Save not Completed";
        }

        //check duplicates
        /* ItemEntity extItemName=dao.getByItemName(item.getItemname());

        if(extItemName!=null){
            return "Save not Completed. Item Name Already Exist...!";
        } */

        //operation
        try {
            //get next item number
            String nextItemNumber=dao.getNextItemNumber();

            //if next number null manually add the next number
            if(nextItemNumber==null){
                item.setItemcode("ITM0009");
            }
            item.setItemcode(nextItemNumber);

            //set added date
            item.setAddeddate(LocalDateTime.now());
            //set added user
            UserEntity loggedUser=daoUser.getByUsername(authentication.getName());
            item.setAddeduser_id(loggedUser);
        

            //save the object in db
            dao.save(item);

            //pass the return to client
            return "OK";
            
        } catch (Exception e) {
            //error message of reason to fail submit
            return "Save not Completed. "+e.getMessage();
        }
    
    }


    @DeleteMapping(value = "/item")
    public String DeleteItem(@RequestBody ItemEntity item){

        //Authentication & Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        //get user privilages according to logged user
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "ITEM");
        if(!userPrivilage.get("delete")){
            return "Access Denied. Delete not Completed";
        }

        //check existnce of item
        ItemEntity extItem=dao.getReferenceById(item.getId());

        if(extItem==null){
            return "Delete not Completed. Item Not Found...!";
        }

        try {
            //set deleted user
            extItem.setDeleteuser_id(daoUser.getByUsername(authentication.getName()));
            //set delete date
            extItem.setDeletedate(LocalDateTime.now());

            //soft delete
            ItemStatusEntity unavailableStatusEntity=daoStatus.getReferenceById(3);
            extItem.setItemstatus_id(unavailableStatusEntity);
            dao.save(extItem);

            return "OK";

        } catch (Exception e) {
            return "Delete not Completed. "+e.getMessage();
        }
    }

    @PutMapping(value = "/item")
    public String UpdateItem(@RequestBody ItemEntity item) {
        //Authentication & Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        //get user privilages according to logged user
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "ITEM");
        if(!userPrivilage.get("update")){
            return "Access Denied. Update not Completed";
        }

        //check existnce of item
        ItemEntity extItem=dao.getReferenceById(item.getId());

        if(extItem==null){
            return "Update not Completed. Item Not Found...!";
        }

        /* //check duplication
        ItemEntity extItemName=dao.getByItemName(item.getItemname());

        if(extItemName==null && extItemName.getId()!=item.getId()){
            return "Update is not Completed : this "+item.getItemcode()+" Item Name already existed. \n Use Different Name for Item";
        }
         */
        
        try {
            //set updated user
            item.setModifyuser_id(daoUser.getByUsername(authentication.getName()));
            //set last updated date
            item.setModifydate(LocalDateTime.now());
            
            dao.save(item);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed. "+e.getMessage();
        }
    }
    
}
