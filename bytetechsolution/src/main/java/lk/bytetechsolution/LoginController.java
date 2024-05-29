package lk.bytetechsolution;

import org.springframework.beans.factory.annotation.Autowired;
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
        logView.setViewName("login.html");
        return logView;
    }

    @RequestMapping(value = "/dashboard")
    public ModelAndView dashboardUI(){
        ModelAndView dashView=new ModelAndView();
        dashView.setViewName("dashboard.html");
        return dashView;
    }

    @GetMapping(value = "/createadmin")
    public String genarateAdmin(){
        UserEntity extUser=daoUser.getByUsername("Admin");

        if(extUser==null){
            UserEntity adminUser=new UserEntity();

            adminUser.setUsername("Admin");
            adminUser.setEmail("admin@gmail.com");
            adminUser.setPassword(BCryptPasswordEncoder.encode("1234"));
            adminUser.setAdded_datetime(LocalDateTime.now());
            adminUser.setStatus(true);
            adminUser.setEmployee_id(daoEmployee.getReferenceById(15));
            
            Set<RoleEntity> userRoles=new HashSet<>();
            userRoles.add(daoRole.getReferenceById(1));
            adminUser.setRoles(userRoles);

            daoUser.save(adminUser);

        }

        return "<script>window.location.replace('/login');</script>";
    }
}
