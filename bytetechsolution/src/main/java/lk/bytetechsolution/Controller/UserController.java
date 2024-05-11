package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.UserEntity;

import java.util.*;

@RestController
public class UserController {
    @Autowired
    private UserDao dao;

    @RequestMapping(value="/user")
    public ModelAndView userUI(){
        ModelAndView userView=new ModelAndView();
        userView.setViewName("user.html");
        return userView;
    }

    @GetMapping(value="/user/alldata",produces = "application/json")
    public List<UserEntity> allEmployeeData(){
        return dao.findAll();
    }
}
