package lk.bytetechsolution.Controller;

import java.util.*;
import java.time.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
/*
* implemented mapping to available for use  
* add implemented mapping to servelet container for use
* fundemental component for build REST full api  (representational state transfer)
* restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.AccessoriesDao;
import lk.bytetechsolution.Dao.CategoryDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Dao.ProcessorDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.AccessoriesEntity;
import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.AccessoriesEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class AccessoriesController {
    @Autowired
    private AccessoriesDao daoAccessories;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private CategoryDao daoCategory;

    @Autowired
    private ItemStatusDao daoItemStatus;

    @Autowired
    private PrivilageController privilageController;

    @RequestMapping(value = "/accessories")
    public ModelAndView asseccoriesUI() {
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView accessoriesView = new ModelAndView();
        // pass the ui
        accessoriesView.setViewName("accessories.html");
        // attributes set to show titles in web page using theamleaf
        accessoriesView.addObject("title", "Accessories Management || Bytetech Solution");
        accessoriesView.addObject("user", authentication.getName());// passing logged user name
        accessoriesView.addObject("EmpName", loggedEmployee);
        accessoriesView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        accessoriesView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return accessoriesView;

    }

    @GetMapping(value = "/accessories/alldata", produces = "application/json")
    public List<AccessoriesEntity> allAccessoriesData() {

        // authentication and autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "ITEM");

        // if current logged user doesnt have privilages show empty list
        if (!userPrivilage.get("select")) {
            return new ArrayList<AccessoriesEntity>();
        }

        return daoAccessories.findAll();
    }


       @GetMapping(value = "/accessories/filteritem", produces = "application/json")
    public List<AccessoriesEntity> allFilterAccessoriesData(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "itemcode", required = false) String itemcode,
            @RequestParam(value = "warranty", required = false) Integer warranty,
            @RequestParam(value = "brand_id", required = false) Integer BrandId
            ) {

        return daoAccessories.filterItemList(id, itemcode, warranty,BrandId);
    }

     @GetMapping(value = "/accessories/{brandId}/itemlist", produces = "application/json")
    public List<AccessoriesEntity> AccessoriesItemList(@PathVariable("brandId") BrandEntity brandId) {
        return daoAccessories.accessoriesItemList(brandId);
    }


    @PostMapping(value = "/accessories")
    public String addAccessoriesData(@RequestBody AccessoriesEntity accessories) {

        // Authentication and Autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "ITEM");

        if (!userPrivilage.get("insert")) {
            return "Permission Denied! Save not Completed";
        }

        // Check any Duplications
        AccessoriesEntity extAccessories = daoAccessories.getByAccessoriesName(accessories.getItemname());

        if (extAccessories != null) {
            return "Save not Completed : given Name - " + accessories.getItemname() + " Already Exist...!";
        }

        try {
            // set AutoGenarated Value
            String nextNumber = daoAccessories.getNextAccessoriesNumber();

            // if next employee number is not come then set manualy last number+1
            if (nextNumber == null) {
                accessories.setItemcode("ASC0001");
            } else {
                accessories.setItemcode(nextNumber);
            }

            // assign added user id
            UserEntity addedUserData = daoUser.getByUsername(authentication.getName());
            // because of security reason only add user id
            accessories.setAddeduser(addedUserData.getId());

            // assign added date
            accessories.setAddeddate(LocalDateTime.now());

            // assign category
            accessories.setCategory_id(daoCategory.getReferenceById(1));

            // saving operation
            daoAccessories.save(accessories);
            // return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/accessories")
    public String deleteProcessorData(@RequestBody AccessoriesEntity accessories) {
        // Authentication and Autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "ITEM");

        if (!userPrivilage.get("delete")) {
            return "Permission Denied! Delete not Completed";
        }

        // existance check
        AccessoriesEntity extAccessories = daoAccessories.getReferenceById(accessories.getId());

        if (extAccessories == null) {
            return "Delete not Completed. Accessories not existed";
        }

        try {

            // assign modify user
            UserEntity deleteUser = daoUser.getByUsername(authentication.getName());
            accessories.setDeleteuser(deleteUser.getId());

            // asign modify time
            accessories.setDeletedate(LocalDateTime.now());

            // accessories status change as soft delete
            accessories.setItemstatus_id(daoItemStatus.getReferenceById(3));

            // save operation
            daoAccessories.save(accessories);

            return "OK";
        } catch (Exception e) {
            return "Update not Completed : " + e.getMessage();
        }

    }

    @PutMapping(value = "/accessories")
    public String updateProcessorData(@RequestBody AccessoriesEntity accessories) {
        // authentication and autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "ITEM");

        if (!userPrivilage.get("update")) {
            return "Permission Denied. Update not completed.";
        }

        // existance check
        AccessoriesEntity extAccessories = daoAccessories.getReferenceById(accessories.getId());

        if (extAccessories == null) {
            return "Update not Completed. Accessories not existed";
        }

        // check duplicate
        AccessoriesEntity extAccessoriesName = daoAccessories.getByAccessoriesName(accessories.getItemname());

        if (extAccessoriesName == null && extAccessoriesName.getId() != accessories.getId()) {
            return "Update is not Completed : this " + accessories.getItemname() + " Item Name is already existed.";
        }

        try {

            // assign modify user
            UserEntity modifyUser = daoUser.getByUsername(authentication.getName());
            accessories.setModifyuser(modifyUser.getId());

            // asign modify time
            accessories.setModifydate(LocalDateTime.now());

            // save operation
            daoAccessories.save(accessories);

            return "OK";
        } catch (Exception e) {
            return "Update not Completed : " + e.getMessage();
        }
    }
}
