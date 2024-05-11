package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.PrivilageDao;
import lk.bytetechsolution.Entity.PrivilageEntity;

import java.util.*;

@RestController
public class PrivilageController {

    @Autowired
    private PrivilageDao dao;

    @RequestMapping(value = "/privilage")
    public ModelAndView privilageUI(){
        ModelAndView privilageView=new ModelAndView();
        privilageView.setViewName("privilage.html");
        return privilageView;
    }
    
    @GetMapping(value="/privilage/alldata",produces = "application/json")
    public List<PrivilageEntity> allPrivilageData(){
        return dao.findAll();
    }
}
