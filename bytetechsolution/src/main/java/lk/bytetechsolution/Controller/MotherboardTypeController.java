package lk.bytetechsolution.Controller;



import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.MotherboardTypeDao;
import lk.bytetechsolution.Entity.MotherboardTypeEntity;


/*
    * implemented mapping to available for use  
    * add implemented mapping to servelet container for use
    * fundemental component for build REST full api  (representational state transfer)
    * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
public class MotherboardTypeController {
     /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private MotherboardTypeDao dao;
     /* 
     * define mapping for get all GEN data from database
     * produce -> data return format(json,xml)
     * value or path -> specify url pattern to which the method will be mapped
     * List<cpuseries> -> return the list of Employee object
     * 
     * also you can use
     * @requestMapping(value="/gpuchipset/alldata",produces='application.json',method=RequestMethod.GET)
     */
    @GetMapping(value = "/motherboardtype/alldata", produces ="application/json" ) 
    public List<MotherboardTypeEntity> allEmployeeData() {

        return dao.findAll();
    }

    //get cpu generation according to cpu socket
    @GetMapping(value = "/motherboardtype/motherboardtypebymotherboardseries/{seriesname}",produces = "application/json")
    public List<MotherboardTypeEntity> getTypeBySeries(@PathVariable("seriesname") String seriesname){
        return dao.getMotherboardTypeBySeries(seriesname);
    }

}
