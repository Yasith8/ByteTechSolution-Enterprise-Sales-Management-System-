package lk.bytetechsolution.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.EmployeeStatusDao;
import lk.bytetechsolution.Entity.EmployeeEntity;
import lk.bytetechsolution.Entity.EmployeeStatusEntity;
import lk.bytetechsolution.Entity.PrivilageEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.*;


/*
    * implemented mapping to available for use  
    * add implemented mapping to servelet container for use
    * fundemental component for build REST full api  (representational state transfer)
    * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
//define mapping to employee UI(/employee)
public class EmployeeController {
    
    /* 
     * AutoWired used for automatic dependency injection
     * inject employeeDao Instance into dao variable
     * the method can use dao for save,retrive,maipulate employee data
     */
    @Autowired 
    private EmployeeDao dao;

    @Autowired
    private EmployeeStatusDao daoStatus;


    //get privilage controller to managing privilages
    private PrivilageController privilageController;

   


    //request employee ui
    @RequestMapping(value="/employee")
    public ModelAndView employeeUI(){
        //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication =SecurityContextHolder.getContext().getAuthentication();
        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView empView=new ModelAndView();
        //pass the ui
        empView.setViewName("employee.html");
        //attributes set to show titles in web page using theamleaf
        empView.addObject("title", "Employee Management || Bytetech Solution");
        empView.addObject("user", authentication.getName());// passing logged user name
        return empView;
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
    @GetMapping(value = "/employee/alldata", produces ="application/json" ) 
    public List<EmployeeEntity> allEmployeeData() {
        return dao.findAll();
    }


    //post mapping
    //used for add new employee to the db
    @PostMapping(value = "/employee")
    public String addEmployee(@RequestBody EmployeeEntity employee){

        //Authentication and Autherization
            // get currunt logged user data
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

           //get user privilage for the Employee Module
        PrivilageEntity userPrivilage=privilageController.getPrivilageByUserModule(auth.getName(),"EMPLOYEE");

        //Check Duplicate 
            //Check Duplicate of NIC
        EmployeeEntity extEmployeeByNic=dao.getByNic(employee.getNic());

        //if nic number already exist return error message
        if(extEmployeeByNic!=null){
            return "Save not Completed : given NIC - "+employee.getNic()+" Already Exist...!";
        }
        
        //check duplicates of Email
        EmployeeEntity extEmployeeByEmail=dao.getByEmail(employee.getEmail());
        
        //if email already exist return error message
        if(extEmployeeByEmail!=null){
            return "Save not Completed : given Email - "+employee.getEmail()+" Already Exist...!";
        }

        try {
            //set AutoGenarated Value
            String nextNumber=dao.getNextEmployeeNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                employee.setEmpid("E0006");
            }
            employee.setEmpid(nextNumber);
            
            dao.save(employee);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : "+e.getMessage();
        }

    }


    //delete request for delete employee data
    @DeleteMapping(value = "/employee")
    public String deleteEmployee(@RequestBody EmployeeEntity employee){

        //authentication and autherzation

        //check employee is existed
        EmployeeEntity extEmployee=dao.getReferenceById(employee.getId());

        if(extEmployee==null){ 
            return "Delete cannot be done. Employee not Exist";
        }

        try {

            //soft delete
            //employee status change to delete
            //delete id is 3
            EmployeeStatusEntity deleteStatus=daoStatus.getReferenceById(3);
            extEmployee.setEmployeestatus_id(deleteStatus);
            dao.save(extEmployee);

            //hard delete---(in case you need)
            //dao.delete(dao.getReferenceById(employee.getId()));

            //return ok message
            return "OK";

        } catch (Exception e) {
            return "Delete not completed. "+e.getMessage();
        }
    }

  
    @PutMapping(value="/employee")
    public String updateEmployee(@RequestBody EmployeeEntity employee){

        //authentication and autherization

        //check employee existence
        EmployeeEntity extEmployee=dao.getReferenceById(employee.getId());

        if(extEmployee==null){
            return "Update is not Completed : Employee not existed";
        }

        //validation part before the update using Employee NIC
        EmployeeEntity extEmployeeNIC=dao.getByNic(employee.getNic());

        if(extEmployeeNIC==null && extEmployeeNIC.getId()!=employee.getId()){
            return "Update is not Completed : this "+employee.getNic()+" NIC Number already existed.";
        }
        
        //validation part using employee email
        EmployeeEntity extEmployeeEmail=dao.getByEmail(employee.getEmail());
        
        if(extEmployeeEmail==null && extEmployeeEmail.getId()!=employee.getId()){
            return "Update is not Completed : this "+employee.getEmail()+" Email address already existed.";
        }

        try {
            //operator
            dao.save(employee);

            //dependencies
            return "OK";
        } catch (Exception e) {
            return "Update is not completed : because of "+e.getMessage();
        }


        
    }

  
   @GetMapping(value = "/employee/listwithoutuseraccount",produces = "application/json")
   public List<EmployeeEntity> getEmployeewithoutUserAccount(){
    return dao.getListWithoutUserAccount();
   }





    
}
