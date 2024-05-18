package lk.bytetechsolution.Controller;

import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.ModuleDao;
import lk.bytetechsolution.Entity.ModuleEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;



import java.util.*;

/*
    * implemented mapping to available for use  
    * add implemented mapping to servelet container for use
    * fundemental component for build REST full api  (representational state transfer)
    * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
public class ModuleController {
     /* 
     * AutoWired used for automatic dependency injection
     * inject employeeDao Instance into dao variable
     * the method can use dao for save,retrive,maipulate employee data
     */

     @Autowired
     private ModuleDao dao;

     @GetMapping(value = "module/alldata",produces = "application/json")
     public List<ModuleEntity> getModuleData(){
        return dao.findAll();
     }
     

}
