package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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

    
}
