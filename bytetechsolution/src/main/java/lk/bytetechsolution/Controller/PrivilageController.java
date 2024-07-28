package lk.bytetechsolution.Controller;

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
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.PrivilageDao;
import lk.bytetechsolution.Entity.PrivilageEntity;

import java.util.*;

/*
    * implemented mapping to available for use  
    * add implemented mapping to servelet container for use
    * fundemental component for build REST full api  (representational state transfer)
    * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
public class PrivilageController {

    /* 
     * AutoWired used for automatic dependency injection
     * inject employeeDao Instance into dao variable
     * the method can use dao for save,retrive,maipulate employee data
     */
    @Autowired
    private PrivilageDao dao;

    //request privilage ui
    @RequestMapping(value = "/privilage")
    public ModelAndView privilageUI(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        ModelAndView privilageView=new ModelAndView();
        privilageView.addObject("title", "Privilage Management || Bytetech Solution");
        privilageView.addObject("user",authentication.getName());
        privilageView.setViewName("privilage.html");
        return privilageView;
    }
    
    @GetMapping(value="/privilage/alldata",produces = "application/json")
    public List<PrivilageEntity> allPrivilageData(){

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        PrivilageEntity userPrivilage=getPrivilageByUserModule(authentication.getName(), "PRIVILAGE");

        if(!userPrivilage.getSelprv()){
            return new ArrayList<PrivilageEntity>();
        }

        return dao.findAll();
    }


    @PostMapping(value="/privilage")
    public String addPrivilage(@RequestBody PrivilageEntity privilage){

        //authenitaation and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        PrivilageEntity userPrivilage=getPrivilageByUserModule(authentication.getName(), "PRIVILAGE");

        if(!userPrivilage.getInsprv()){
            return "Access Denied. Save not Completed";
        }

        //duplicate check
        PrivilageEntity extPrivilage=dao.getPrivilagebyRoleAndModule(privilage.getModule_id().getId(),privilage.getRole_id().getId());

        if(extPrivilage!=null){
            return "Save not Completed. Privilage Already Exist by given role and module";
        }

        try {
            //operation
            dao.save(privilage);
            return "OK";
        } catch (Exception e) {
            return e.getMessage();
        }
    }


    @DeleteMapping("/privilage")
    public String deletePrivilage(@RequestBody PrivilageEntity privilage){

        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        PrivilageEntity userPrivilage=getPrivilageByUserModule(authentication.getName(), "PRIVILAGE");

        if(!userPrivilage.getDelprv()){
            return "Access Denied. Delete not Completed";
        }

        //check existed
        PrivilageEntity extPrivilage=dao.getPrivilagebyRoleAndModule(privilage.getModule_id().getId(),privilage.getRole_id().getId());

        //if null
        if(extPrivilage==null){
            return "Delete not Completed. Privilage Not Exist by given role and module";
        }
        
        try {
            //operation
            extPrivilage.setInsprv(false);
            extPrivilage.setDelprv(false);
            extPrivilage.setSelprv(false);
            extPrivilage.setUpdprv(false);
            dao.save(extPrivilage);

            return "OK";
            
        } catch (Exception e) {
            return "Delete Not Completed. "+e.getMessage();
        }
    }
    
    @PutMapping("/privilage")
    public String updatePrivilage(@RequestBody PrivilageEntity privilage){
        //authentication and autherization
        
        //existance check
        PrivilageEntity extPrivilage=dao.getPrivilagebyRoleAndModule(privilage.getModule_id().getId(),privilage.getRole_id().getId());
        
        if(extPrivilage==null){
            return "Update not Completed. Privilage Not Exist by given role and module";  
        }

        
        
        try {
            //operation
            dao.save(privilage);
            
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed. "+e.getMessage();
        }
    }

    public PrivilageEntity getPrivilageByUserModule(String username,String modulename){

        if(username.equals("Admin")){
            PrivilageEntity adminPriv=new PrivilageEntity(true,true,true,true);
            return adminPriv;
        }else{
            String priv=dao.getPrivilageByUserModule(username, modulename);
            String[] privArray=priv.split(",");

            Boolean select=privArray[0].equals("1");
            Boolean insert=privArray[1].equals("1");
            Boolean delete=privArray[2].equals("1");
            Boolean update=privArray[3].equals("1");

            PrivilageEntity userprv=new PrivilageEntity(select,insert,delete,update);

            return userprv;
        }
    }
}
