package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.SupplierDao;
import lk.bytetechsolution.Dao.SupplierStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.SupplierEntity;
import lk.bytetechsolution.Entity.SupplierHasBrandCategoryEntity;
import lk.bytetechsolution.Entity.UserEntity;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
public class SupplierController {
    
    @Autowired
    private SupplierDao daoSupplier;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private SupplierStatusDao daoSupplierStatus;

    @Autowired
    private PrivilageController privilageController;


    @RequestMapping(value = "/supplier")
    public ModelAndView getSupplierUI(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
         //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView supplierView=new ModelAndView();
        //pass the ui
        supplierView.setViewName("supplier.html");
        //attributes set to show titles in web page using theamleaf
        supplierView.addObject("title", "Supplier Management || Bytetech Solution");
        supplierView.addObject("user", authentication.getName());// passing logged user name
        supplierView.addObject("EmpName", loggedEmployee);
        supplierView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        supplierView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return supplierView;
    }

    @GetMapping(value = "/supplier/alldata",produces = "application/json")
    public List<SupplierEntity> GetAllSupplierData(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"SUPPLIER");

        if(!userPrivilage.get("select")){
            return new ArrayList<SupplierEntity>();
        }

        return daoSupplier.findAll();
    }

    @GetMapping(value = "/supplier/suppliergetbybrandcategory",params = {"categoryid","brandid"},produces = "application/json")
    public List<SupplierEntity> GetAllSupplierDataByCategoryBrand(@RequestParam("categoryid") Integer categoryid,@RequestParam("brandid") Integer brandid){
        return daoSupplier.getSupplierByBrandCategory(categoryid,brandid);
    }


    @PostMapping(value = "/supplier")
    public String addSupplierData(@RequestBody SupplierEntity supplier){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"SUPPLIER");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //check already existance
        SupplierEntity extSupplierEmail=daoSupplier.getByEmail(supplier.getEmail());

        if(extSupplierEmail!=null){
            return "Save not Completed : given Name - "+supplier.getEmail()+" Already Exist...!";
        }


        try {

            //set AutoGenarated Value
            String nextNumber=daoSupplier.getNextSupplierNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                supplier.setSupplierid("SUP0001");
            }else{
                supplier.setSupplierid(nextNumber);
            }

            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            supplier.setAddeduser(addedUserData.getId());

            supplier.setAddeddate(LocalDateTime.now());

            /* System.out.println("Supplier data: " + supplier); */

            for(SupplierHasBrandCategoryEntity supplierHasBrandCategory:supplier.getSupplier_has_brand_category()){
                supplierHasBrandCategory.setSupplier_id(supplier);
            }

            daoSupplier.save(supplier);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed: "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/supplier")
    public String deleteSupplierData(@RequestBody SupplierEntity supplier){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"SUPPLIER");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

       SupplierEntity extSupplier=daoSupplier.getReferenceById(supplier.getId());
       if(extSupplier==null){
        return "Delete not Completed.Supplier not exists";
       }

       try {
        UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
        supplier.setDeleteuser(deleteUser.getId());

        supplier.setDeletedate(LocalDateTime.now());

        supplier.setSupplierstatus_id(daoSupplierStatus.getReferenceById(3));

        daoSupplier.save(supplier);

        return "OK";
       } catch (Exception e) {
        return "Delete not completed. "+e.getMessage();
       }
    }

    @PutMapping(value = "/supplier")
    public String updateSupplierData(@RequestBody SupplierEntity supplier) {
       
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"SUPPLIER");

        if(!userPrivilage.get("update")){
            return "Permission Denied! Update not Completed";
        }

        //check existance
        SupplierEntity extSupplier=daoSupplier.getReferenceById(supplier.getId());

        if(extSupplier==null){
            return "Delete not Completed.Supplier not exists";
        }

        SupplierEntity extSupplierEmail=daoSupplier.getByEmail(supplier.getEmail());
        if(extSupplier==null && extSupplierEmail.getId()!=supplier.getId()){
            return "Update is not Completed : this "+supplier.getEmail()+" Supplier Email is already existed.";
        }


        try {
            //asign update user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            supplier.setModifyuser(modifyUser.getId());

            //assign update date
            supplier.setModifydate(LocalDateTime.now());

            for(SupplierHasBrandCategoryEntity supplierHasBrandCategory:supplier.getSupplier_has_brand_category()){
                supplierHasBrandCategory.setSupplier_id(supplier);
            }

            //save the data
            daoSupplier.save(supplier);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed."+e.getMessage();
        }
    }
}
