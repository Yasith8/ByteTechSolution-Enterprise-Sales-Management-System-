package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.UserEntity;

import java.util.*;
import java.time.*;


/*
    * implemented mapping to available for use  
    * add implemented mapping to servelet container for use
    * fundemental component for build REST full api  (representational state transfer)
    * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
//define mapping to user UI(/user)
public class UserController {

    /* 
     * AutoWired used for automatic dependency injection
     * inject employeeDao Instance into dao variable
     * the method can use dao for save,retrive,maipulate employee data
     */
    @Autowired
    private UserDao dao;

    //request employee ui
    @RequestMapping(value="/user")
    public ModelAndView userUI(){
        ModelAndView userView=new ModelAndView();
        userView.setViewName("user.html");
        return userView;
    }

     /* 
     * define mapping for get all employee data from employee database
     * produce -> data return format(json,xml)
     * value or path -> specify url pattern to which the method will be mapped
     * List<Employee> -> return the list of Employee object
     * 
     * also you can use
     * @requestMapping(value="/employee/alldata",produces='application.json',method=RequestMethod.GET)
     */
    @GetMapping(value="/user/alldata",produces = "application/json")
    public List<UserEntity> allUserData(){
        return dao.findAll();
    }

    @PostMapping(value = "user")
    public String addUserData(@RequestBody UserEntity user){

        //--------check duplication------------
        //check if any user with this password
        UserEntity extUserEmail=dao.getByEmail(user.getEmail());
        //if anyone find with same email
        if(extUserEmail!=null){
            return "Save not Completed : "+extUserEmail.getEmail()+" Email Already Existed.";
        }
        
        //check if any user with same username
        UserEntity extUsername=dao.getByUsername(user.getUsername());
        if(extUsername!=null){
            return "Save not Completed : "+extUsername.getEmail()+" Username Already Existed.";
        }


        try {
            //authentication and autherization

            //operations

            //set submitted date and time
            user.setAdded_datetime(LocalDateTime.now());
            //save in db
            dao.save(user);

            //dependencies
            return "OK";

            
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }


    }


}
