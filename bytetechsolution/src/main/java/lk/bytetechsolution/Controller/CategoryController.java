package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import lk.bytetechsolution.Dao.CategoryDao;
import lk.bytetechsolution.Entity.CategoryEntity;

import org.springframework.web.bind.annotation.GetMapping;



@RestController
public class CategoryController {
    

    @Autowired
    private CategoryDao dao;


    @GetMapping(value = "/category/alldata",produces = "application/json")
    public List<CategoryEntity> allCategoryData(){
        return dao.findAll();
    }

   
    
}
