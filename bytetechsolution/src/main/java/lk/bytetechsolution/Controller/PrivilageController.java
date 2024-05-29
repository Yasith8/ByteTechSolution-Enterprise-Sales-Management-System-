package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
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
        ModelAndView privilageView=new ModelAndView();
        privilageView.setViewName("privilage.html");
        return privilageView;
    }
    
    @GetMapping(value="/privilage/alldata",produces = "application/json")
    public List<PrivilageEntity> allPrivilageData(){
        return dao.findAll();
    }


    @PostMapping(value="/privilage")
    public String addPrivilage(@RequestBody PrivilageEntity privilage){

        //authenitaation and autherization


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

    
}
