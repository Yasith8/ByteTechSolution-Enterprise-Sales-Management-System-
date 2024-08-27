package lk.bytetechsolution.Controller;


import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
/*
* implemented mapping to available for use  
* add implemented mapping to servelet container for use
* fundemental component for build REST full api  (representational state transfer)
* restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.ProcessorDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.EmployeeEntity;
import lk.bytetechsolution.Entity.ProcessorEntity;
import lk.bytetechsolution.Entity.UserEntity;
@RestController
public class ProcessorController {
 /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private ProcessorDao daoProcessor;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @RequestMapping(value = "/processor")
    public ModelAndView processorUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView processorView=new ModelAndView();
        //pass the ui
        processorView.setViewName("processor.html");
        //attributes set to show titles in web page using theamleaf
        processorView.addObject("title", "Processor Management || Bytetech Solution");
        processorView.addObject("user", authentication.getName());// passing logged user name
        processorView.addObject("EmpName", loggedEmployee);
        processorView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        processorView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return processorView;

    }
    
    @GetMapping(value = "/processor/alldata", produces ="application/json" ) 
    public List<ProcessorEntity> allEmployeeData() {

        return daoProcessor.findAll();
    }
}
