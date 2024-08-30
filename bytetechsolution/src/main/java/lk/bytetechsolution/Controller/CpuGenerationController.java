package lk.bytetechsolution.Controller;



import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.CpuGenerationDao;
import lk.bytetechsolution.Entity.CpuGenerationEntity;


import java.util.*;


/*
    * implemented mapping to available for use  
    * add implemented mapping to servelet container for use
    * fundemental component for build REST full api  (representational state transfer)
    * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
public class CpuGenerationController {
     /* 
     * AutoWired used for automatic dependency injection
     * inject cpugenerationDao Instance into dao variable
     * the method can use dao for save,retrive,maipulate employee data
     */
    @Autowired
    private CpuGenerationDao dao;


    /* 
     * define mapping for get all GEN data from database
     * produce -> data return format(json,xml)
     * value or path -> specify url pattern to which the method will be mapped
     * List<cpugeneration> -> return the list of Employee object
     * 
     * also you can use
     * @requestMapping(value="/cpugeneration/alldata",produces='application.json',method=RequestMethod.GET)
     */
    @GetMapping(value = "/cpugeneration/alldata", produces ="application/json" ) 
    public List<CpuGenerationEntity> allEmployeeData() {

        return dao.findAll();
    }

    //get cpu generation according to cpu socket
    @GetMapping(value = "/cpugeneration/cpugenerationbycpusocket/{socketname}",produces = "application/json")
    public List<CpuGenerationEntity> getBrandByCategory(@PathVariable("socketname") String socketname){
        return dao.getGenBySocket(socketname);
    }

}
