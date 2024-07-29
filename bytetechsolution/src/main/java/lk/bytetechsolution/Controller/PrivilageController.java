package lk.bytetechsolution.Controller;

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
        HashMap<String,Boolean> userPrivilage=getPrivilageByUserModule(authentication.getName(), "PRIVILAGE");

        if(!userPrivilage.get("select")){
            return new ArrayList<PrivilageEntity>();
        }

        return dao.findAll();
    }


    @PostMapping(value="/privilage")
    public String addPrivilage(@RequestBody PrivilageEntity privilage){

        //authenitaation and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=getPrivilageByUserModule(authentication.getName(), "PRIVILAGE");

        if(!userPrivilage.get("insert")){
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
        HashMap<String,Boolean> userPrivilage=getPrivilageByUserModule(authentication.getName(), "PRIVILAGE");

        if(!userPrivilage.get("delete")){
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
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=getPrivilageByUserModule(authentication.getName(), "PRIVILAGE");

        if(!userPrivilage.get("update")){
            return "Access Denied. Update not Completed";
        }
        
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

    //get mapping for get privilage by log user module
    @GetMapping(value = "/privilage/byloggeduser/{modulename}",produces = "application/json")
    public HashMap<String,Boolean> getPrivilageByLoggedUserModule(@PathVariable("modulename") String modulename){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        return getPrivilageByUserModule(authentication.getName(), modulename);
    }



    public HashMap<String,Boolean> getPrivilageByUserModule(String username,String modulename){

        HashMap<String,Boolean> userPrivilage=new HashMap<String,Boolean>();

        if(username.equals("Admin")){
            userPrivilage.put("select",true);
            userPrivilage.put("insert",true);
            userPrivilage.put("update",true);
            userPrivilage.put("delete",true);
        }else{
            String userprv=dao.getPrivilageByUserModule(username, modulename);

            String[] userprivList=userprv.split(",");

            userPrivilage.put("select", userprivList[0].equals("1"));
            userPrivilage.put("insert",userprivList[1].equals("1"));
            userPrivilage.put("update", userprivList[2].equals("1"));
            userPrivilage.put("delete", userprivList[3].equals("1"));

        }
        return userPrivilage;
    }


}
