package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.DesigationDao;
import lk.bytetechsolution.Entity.DesignationEntity;

import java.util.*;



/*
    * implemented mapping to available for use  
    * add implemented mapping to servelet container for use
    * fundemental component for build REST full api  (representational state transfer)
    * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
//define mapping to Designation UI(/designation)
public class DesignationController {

    /* 
     * AutoWired used for automatic dependency injection
     * inject DesignationDao Instance into dao variable
     * the method can use dao for save,retrive,maipulate designation data
     */
    @Autowired
    private DesigationDao dao;


     /* 
     * define mapping for get all Designation data from designation table
     * produce -> data return format(json,xml)
     * value or path -> specify url pattern to which the method will be mapped
     * List<DesignationEntity> -> return the list of Designation object
     * 
     * also you can use
     * @requestMapping(value="/designation/alldata",produces='application.json',method=RequestMethod.GET)
     */
    @GetMapping(value = "/designation/alldata",produces = "application/json")
    public List<DesignationEntity> allDesignationData(){
        return dao.findAll();
    }
}
