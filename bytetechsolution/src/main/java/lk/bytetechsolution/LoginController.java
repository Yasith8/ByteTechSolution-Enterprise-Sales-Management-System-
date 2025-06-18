package lk.bytetechsolution;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.RoleDao;
import lk.bytetechsolution.Dao.UserDao;
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
    private BCryptPasswordEncoder BCryptPasswordEncoder;

    
    @RequestMapping(value = "/login")
    public ModelAndView logInUI(){
        ModelAndView logView=new ModelAndView();
        logView.addObject("title", "LogIn || Bytetech Solution");
        logView.setViewName("login.html");
        return logView;
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
