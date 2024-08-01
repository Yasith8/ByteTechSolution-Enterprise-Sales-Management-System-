package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.ItemDao;
import lk.bytetechsolution.Entity.ItemEntity;

import java.util.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class ItemController {
    
    @Autowired
    private ItemDao dao;

    @Autowired
    private PrivilageController privilageController;


    @RequestMapping(value = "/item") 
    public ModelAndView ItemUI(){
        ModelAndView itemView=new ModelAndView();
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        itemView.addObject("title", "Item Management || ByteTech Solution");
        itemView.addObject("user", authentication.getName());
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
        ItemEntity extItemName=dao.getByItemName(item.getItemname());

        if(extItemName!=null){
            return "Save not Completed. Item Name Already Exist...!";
        }

        //operation
        try {
            //get next item number
            String nextItemNumber=dao.getNextItemNumber();

            //if next number null manually add the next number
            if(nextItemNumber==null){
                item.setItemcode("ITM0009");
            }
            item.setItemcode(nextItemNumber);

            //save the object in db
            dao.save(item);

            //pass the return to client
            return "OK";
            
        } catch (Exception e) {
            //error message of reason to fail submit
            return "Save not Completed. "+e.getMessage();
        }
    
    }
    
}
