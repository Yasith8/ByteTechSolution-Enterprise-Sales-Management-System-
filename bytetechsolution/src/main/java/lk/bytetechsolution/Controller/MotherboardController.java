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

import lk.bytetechsolution.Dao.CategoryDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.ItemStatusDao;
import lk.bytetechsolution.Dao.MotherboardDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.BrandEntity;
import lk.bytetechsolution.Entity.MotherboardEntity;
import lk.bytetechsolution.Entity.ProcessorEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class MotherboardController {
    /*
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private MotherboardDao daoMotherboard;

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

    @RequestMapping(value = "/motherboard")
    public ModelAndView motherboardUI() {
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView motherboardView = new ModelAndView();
        // pass the ui
        motherboardView.setViewName("motherboard.html");
        // attributes set to show titles in web page using theamleaf
        motherboardView.addObject("title", "Motherboard Management || Bytetech Solution");
        motherboardView.addObject("user", authentication.getName());// passing logged user name
        motherboardView.addObject("EmpName", loggedEmployee);
        motherboardView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        motherboardView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return motherboardView;

    }

    @GetMapping(value = "/motherboard/alldata", produces = "application/json")
    public List<MotherboardEntity> allMotherboardData() {

        // authentication and autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "ITEM");

        // if current logged user doesnt have privilages show empty list
        if (!userPrivilage.get("select")) {
            return new ArrayList<MotherboardEntity>();
        }

        return daoMotherboard.findAll();
    }

    @GetMapping(value = "/motherboard/filteritem", produces = "application/json")
    public List<MotherboardEntity> allFilterProcessorData(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "itemcode", required = false) String itemcode,
            @RequestParam(value = "warranty", required = false) Integer warranty,
            @RequestParam(value = "maxcapacity", required = false) Integer maxcapacity,
            @RequestParam(value = "motherboardformfactor_id", required = false) Integer motherboardformfactorId,
            @RequestParam(value = "motherboardseries_id", required = false) Integer motherboardseriesId,
            @RequestParam(value = "motherboardtype_id", required = false) Integer motherboardtypeId,
            @RequestParam(value = "cpusocket_id", required = false) Integer cpusocketId,
            @RequestParam(value = "memorytype_id", required = false) Integer memorytypeId,
            @RequestParam(value = "interface_id", required = false) Integer interfaceid,
            @RequestParam(value = "brand_id", required = false) Integer brandId
            ) {

        return daoMotherboard.filterItemList(id, itemcode, warranty, maxcapacity, motherboardformfactorId,
                motherboardseriesId, motherboardtypeId, cpusocketId, memorytypeId, interfaceid,brandId);
    }

    @GetMapping(value = "/motherboard/{brandId}/itemlist", produces = "application/json")
    public List<MotherboardEntity> MotherboardItemList(@PathVariable("brandId") BrandEntity brandId) {

        return daoMotherboard.motherboardItemList(brandId);
    }

    @PostMapping(value = "/motherboard")
    public String addMotherboardData(@RequestBody MotherboardEntity motherboard) {

        // Authentication and Autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "ITEM");

        if (!userPrivilage.get("insert")) {
            return "Permission Denied! Save not Completed";
        }

        // Check any Duplications
        MotherboardEntity extMotherboard = daoMotherboard.getByMotherboardName(motherboard.getItemname());

        if (extMotherboard != null) {
            return "Save not Completed : given Name - " + motherboard.getItemname() + " Already Exist...!";
        }

        try {
            // set AutoGenarated Value
            String nextNumber = daoMotherboard.getNextMotherboardNumber();

            // if next employee number is not come then set manualy last number+1
            if (nextNumber == null) {
                motherboard.setItemcode("MBR0001");
            } else {
                motherboard.setItemcode(nextNumber);
            }

            // assign added user id
            UserEntity addedUserData = daoUser.getByUsername(authentication.getName());
            // because of security reason only add user id
            motherboard.setAddeduser(addedUserData.getId());

            // assign added date
            motherboard.setAddeddate(LocalDateTime.now());

            // assign category
            motherboard.setCategory_id(daoCategory.getReferenceById(2));

            // saving operation
            daoMotherboard.save(motherboard);
            // return the message about success
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/motherboard")
    public String deleteMotherboardData(@RequestBody MotherboardEntity motherboard) {
        // Authentication and Autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "ITEM");

        if (!userPrivilage.get("delete")) {
            return "Permission Denied! Delete not Completed";
        }

        // existance check
        MotherboardEntity extMotherboard = daoMotherboard.getReferenceById(motherboard.getId());

        if (extMotherboard == null) {
            return "Delete not Completed. Processor not existed";
        }

        try {

            // assign modify user
            UserEntity deleteUser = daoUser.getByUsername(authentication.getName());
            motherboard.setDeleteuser(deleteUser.getId());

            // asign modify time
            motherboard.setDeletedate(LocalDateTime.now());

            // processor status change as soft delete
            motherboard.setItemstatus_id(daoItemStatus.getReferenceById(3));

            // save operation
            daoMotherboard.save(motherboard);

            return "OK";
        } catch (Exception e) {
            return "Update not Completed : " + e.getMessage();
        }

    }

    @PutMapping(value = "/motherboard")
    public String updateMotherboardData(@RequestBody MotherboardEntity motherboard) {
        // authentication and autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "ITEM");

        if (!userPrivilage.get("update")) {
            return "Permission Denied. Update not completed.";
        }

        // existance check
        MotherboardEntity extMotherboard = daoMotherboard.getReferenceById(motherboard.getId());

        if (extMotherboard == null) {
            return "Update not Completed. Processor not existed";
        }

        // check duplicate
        MotherboardEntity extMotherboardName = daoMotherboard.getByMotherboardName(motherboard.getItemname());

        if (extMotherboardName == null && extMotherboard.getId() != motherboard.getId()) {
            return "Update is not Completed : this " + motherboard.getItemname() + " Item Name is already existed.";
        }

        try {

            // assign modify user
            UserEntity modifyUser = daoUser.getByUsername(authentication.getName());
            motherboard.setModifyuser(modifyUser.getId());

            // asign modify time
            motherboard.setModifydate(LocalDateTime.now());

            // save operation
            daoMotherboard.save(motherboard);

            return "OK";
        } catch (Exception e) {
            return "Update not Completed : " + e.getMessage();
        }
    }

}
