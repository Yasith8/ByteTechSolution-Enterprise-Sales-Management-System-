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

@RestController
public class ItemController {
    
    @Autowired
    private ItemDao dao;

    @Autowired
    private PrivilageController privilageController;


    @RequestMapping ModelAndView ItemUI(){
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
}
