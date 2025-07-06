package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
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

    @Autowired
    private EmployeeDao daoEmployee;

    private PrivilageController privilageController=new PrivilageController();

    private BCryptPasswordEncoder bCryptPasswordEncoder=new BCryptPasswordEncoder();


    //request employee ui
    @RequestMapping(value="/user")
    public ModelAndView userUI(){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

          //get looged user object
          UserEntity loggedUser=dao.getByUsername(authentication.getName());

          //get Logged user Employee data
          String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());


        ModelAndView userView=new ModelAndView();
        userView.addObject("title", "User Management || Bytetech Solution");
        userView.addObject("user", authentication.getName());
        userView.addObject("EmpName",loggedEmployee);
        userView.addObject("UserRole",loggedUser.getRoles().iterator().next().getName());//get the first role
        userView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

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
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "USER");

        if(!userPrivilage.get("select")){
            return new ArrayList<UserEntity>();
        }

        return dao.findAll();
    }
     @GetMapping(value="/user/userbyid/{userId}",produces = "application/json")
    public List<UserEntity> FindUserById(@PathVariable("userId") Integer userId){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "USER");

        if(!userPrivilage.get("select")){
            return new ArrayList<UserEntity>();
        }

        return dao.findUserById(userId);
    }

    @PostMapping(value = "/user")
    public String addUserData(@RequestBody UserEntity user){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "USER");

        if(!userPrivilage.get("insert")){
            return "Access Denied. Save not Completed.";
        }

        //--------check duplication------------
        //check if any user with this password
        UserEntity extUserEmail=dao.getByEmail(user.getEmail());
        //if anyone find with same email
        if(extUserEmail != null){
            return "Save not Completed : "+extUserEmail.getEmail()+" Email Already Existed.";
        }
        
        //check if any user with same username
        UserEntity extUsername=dao.getByUsername(user.getUsername());
        if(extUsername != null){
            return "Save not Completed : "+extUsername.getEmail()+" Username Already Existed.";
        }


        try {

            //operations

            //set submitted date and time
            user.setAdded_datetime(LocalDateTime.now());

            //password bycrypt
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            //save in db
            dao.save(user);

            //dependencies
            return "OK";

            
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }


    }


    @DeleteMapping(value = "/user")
    public String deleteUser(@RequestBody UserEntity user){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "USER");

        if(!userPrivilage.get("delete")){
            return "Access Denied. Delete not Completed.";
        }

        //check user exist
        UserEntity extUser=dao.getReferenceById(user.getId());

        if(extUser==null){
            return "Delete not Completed. User is not Existed";
        }

        try {
            extUser.setStatus(false);
            dao.save(extUser);
            return "OK";

            //hard delete---(in case you need)
            //dao.delete(dao.getReferenceById(user.getId()));
            
        } catch (Exception e) {
            return "Delete not Completed"+e.getMessage();
        }
    }

    @PutMapping(value = "/user")
    public String updateUser(@RequestBody UserEntity user){

        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "USER");

        if(!userPrivilage.get("update")){
            return "Access Denied. Update not Completed.";
        }

        //user existance
        UserEntity extUser=dao.getReferenceById(user.getId());

        //if user not exist
        if(extUser==null){
            return "User is not Exist";
        }

        UserEntity extUserEmail=dao.getByEmail(user.getEmail());
        if(extUserEmail !=null && extUserEmail.getId() != extUser.getId()){
            return "Added User Email is already Exist";
        }

        try {
            dao.save(user);
            return "OK";
        } catch (Exception e) {
            return "Update not completed. System has following errors:"+e.getMessage();
        }


    }


}
