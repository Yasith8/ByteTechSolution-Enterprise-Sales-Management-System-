package lk.bytetechsolution;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.ModuleDao;
import lk.bytetechsolution.Dao.RoleDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.LoggedUserEntity;
import lk.bytetechsolution.Entity.ModuleEntity;
import lk.bytetechsolution.Entity.RoleEntity;
import lk.bytetechsolution.Entity.UserEntity;

import java.time.*;
import java.util.*;

@RestController
public class LoginController {

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private RoleDao daoRole;

    @Autowired
    private ModuleDao daoModule;

    @Autowired
    private BCryptPasswordEncoder BCryptPasswordEncoder;

    
    @RequestMapping(value = "/login")
    public ModelAndView logInUI(){
        ModelAndView logView=new ModelAndView();
        logView.addObject("title", "LogIn || Bytetech Solution");
        logView.setViewName("login.html");
        return logView;
    }


    @RequestMapping(value = "/setupmyacc")
    public ModelAndView userSeyupView(){
         ModelAndView setupUserView=new ModelAndView();
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // pass the ui
        setupUserView.setViewName("setupuseraccount.html");
        // attributes set to show titles in web page using theamleaf
        setupUserView.addObject("title", "Setup My Profile || Bytetech Solution");
        setupUserView.addObject("user", authentication.getName());// passing logged user name
        setupUserView.addObject("EmpName", loggedEmployee);
        setupUserView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        setupUserView.addObject("LoggedUserPhoto", loggedUser.getPhoto());
        return setupUserView;
    }

    @RequestMapping(value = "/loggeduserdetails")
    public LoggedUserEntity gerLoggedUserData(){
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        LoggedUserEntity loggedUserDetails=new LoggedUserEntity();
        loggedUserDetails.setUsername(loggedUser.getUsername());
        loggedUserDetails.setOldusername(loggedUser.getUsername());
        loggedUserDetails.setPhoto(loggedUser.getPhoto());
        loggedUserDetails.setEmail(loggedUser.getEmail()); 

        return loggedUserDetails;
    }
    
    @PostMapping(value="/loggeduserdetails/insert")
    public String insertUserData(@RequestBody LoggedUserEntity loggeduser){
        //user existance
        UserEntity extUser=daoUser.getByUsername(loggeduser.getOldusername());
        
        //if user not exist
        if(extUser==null){
            return "User is not Exist";
        }
        UserEntity extUserByUsername=daoUser.getByUsername(loggeduser.getUsername());
        if(extUserByUsername !=null && extUser.getId() != extUserByUsername.getId()){
            return "Added Username is already exist in the system.";
        }
        
        UserEntity extUserEmail=daoUser.getByEmail(loggeduser.getEmail());
        if(extUserEmail !=null && extUser.getId() != extUserEmail.getId()){
            return "Added Email is already exist in the system.";
        }

        extUser.setUsername(loggeduser.getUsername());
        extUser.setPhoto(loggeduser.getPhoto());
        extUser.setEmail(loggeduser.getEmail());
        extUser.setAdded_datetime(LocalDateTime.now());
        
        //check existance
       if(loggeduser.getOldpassword() != null && loggeduser.getNewpassword() != null){
    // First, verify the old password is correct
    if(!BCryptPasswordEncoder.matches(loggeduser.getOldpassword(), extUser.getPassword())){
        return "Change not Completed: Old password is not matched.";
    }
    
    // Check if new password is different from old password
    if(BCryptPasswordEncoder.matches(loggeduser.getNewpassword(), extUser.getPassword())){
        return "Change not Completed: New password cannot be the same as old password.";
    }
    
    // If all validations pass, update the password
    extUser.setPassword(BCryptPasswordEncoder.encode(loggeduser.getNewpassword()));
}

        try {
            daoUser.save(extUser);
            return "OK";
        } catch (Exception e) {
            return "Update not completed. System has following errors:"+e.getMessage();
        }

        

    }

    @RequestMapping(value="/denymodulebyloggeduser")
        public List<ModuleEntity> getDeniedModulesByUser(){
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserEntity loggedUser = daoUser.getByUsername(authentication.getName());
            return daoModule.getModuleByLoggedUsername(loggedUser.getUsername());
        }
    

    @RequestMapping(value = "/dashboard")
    public ModelAndView dashboardUI(){
        ModelAndView dashView=new ModelAndView();
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // pass the ui
        dashView.setViewName("supplierpayment.html");
        // attributes set to show titles in web page using theamleaf
        dashView.addObject("title", "Dashboard || Bytetech Solution");
        dashView.addObject("user", authentication.getName());// passing logged user name
        dashView.addObject("EmpName", loggedEmployee);
        dashView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        dashView.addObject("LoggedUserPhoto", loggedUser.getPhoto());
        dashView.setViewName("dashboard.html");
        return dashView;
    }
    
    @RequestMapping(value = "/errorpage")
    public ModelAndView errorPageUI(){
        ModelAndView errorView=new ModelAndView();
        errorView.addObject("title", "404 Not Found !");
        errorView.setViewName("errorpage.html");
        return errorView;
    }

    @GetMapping(value = "/createadmin")
    public String genarateAdmin(){
        //process of genarate new admin

        //check if there is username called Admin
        UserEntity extUser=daoUser.getByUsername("Admin");

        //if not
        if(extUser==null){
            //create new user
            UserEntity adminUser=new UserEntity();

            //set data for attibutes
            adminUser.setUsername("Admin");
            adminUser.setEmail("admin@gmail.com");
            adminUser.setPassword(BCryptPasswordEncoder.encode("1234"));
            adminUser.setAdded_datetime(LocalDateTime.now());
            adminUser.setStatus(true);
            adminUser.setEmployee_id(daoEmployee.getReferenceById(15));
            
            //get user roles by hash set
            Set<RoleEntity> userRoles=new HashSet<>();
            //add admin user roles id
            userRoles.add(daoRole.getReferenceById(1));
            //set that admin user role for admin user object
            adminUser.setRoles(userRoles);

            //save the admin(user)
            daoUser.save(adminUser);

        }

        return "<script>window.location.replace('/login');</script>";
    }
}
