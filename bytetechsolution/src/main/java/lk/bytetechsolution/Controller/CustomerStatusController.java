package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.CustomerStatusDao;
import lk.bytetechsolution.Entity.CustomerStatusEntity;

import java.util.*;

/*
    * implemented mapping to available for use  
    * add implemented mapping to servelet container for use
    * fundemental component for build REST full api  (representational state transfer)
    * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
//define mapping to employee UI(/employeestatus)
public class CustomerStatusController {
     /* 
     * AutoWired used for automatic dependency injection
     * inject EmployeeStatusDao Instance into dao variable
     * the method can use dao for save,retrive,maipulate employee data
     */
    @Autowired
    private CustomerStatusDao dao;


    /* 
     * define mapping for get all EmploeeStatus data from EmploeeStatus table
     * produce -> data return format(json,xml)
     * value or path -> specify url pattern to which the method will be mapped
     * List<EmploeeStatusEntity> -> return the list of EmploeeStatus object
     * 
     * also you can use
     * @requestMapping(value="/designation/alldata",produces='application.json',method=RequestMethod.GET)
     */
    @GetMapping(value = "/customerstatus/alldata", produces="application/json")
    public List<CustomerStatusEntity> getAllCustomerStatusData(){
        return dao.findAll();
    }

  
}
