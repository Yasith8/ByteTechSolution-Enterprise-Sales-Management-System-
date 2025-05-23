package lk.bytetechsolution.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.GRNDao;
import lk.bytetechsolution.Dao.GRNStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.CategoryEntity;
import lk.bytetechsolution.Entity.GRNEntity;
import lk.bytetechsolution.Entity.GRNItemEntity;
import lk.bytetechsolution.Entity.SerialNoListEntity;
import lk.bytetechsolution.Entity.UserEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


/* 
 * @RestController is a specialized version of @Controller, combining @Controller and @ResponseBody to simplify RESTful API development.
 * It allows Spring Boot to automatically detect implementation classes through classpath scanning
 * add implemented mapping to servelet container for use
 * fundemental component for build REST full api  (representational state transfer)
 * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
 */
@RestController
public class GRNController {
    /* 
     * AutoWired used for automatic dependency injection
     * Autowired automatically injects an instance of a class where it’s needed, without you having to create it manually
     * inject this Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private GRNDao daoGRN;

     @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private GRNStatusDao daoGRNStatus;

    @Autowired
    private PrivilageController privilageController;

   @RequestMapping(value = "/grn")
   public ModelAndView GetGRNUI(){
    //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView grnView=new ModelAndView();
        //pass the ui
        grnView.setViewName("grn.html");
        //attributes set to show titles in web page using theamleaf
        grnView.addObject("title", "GRN Management || Bytetech Solution");
        grnView.addObject("user", authentication.getName());// passing logged user name
        grnView.addObject("EmpName", loggedEmployee);
        grnView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        grnView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return grnView;
   }

   @PostMapping(value = "/grn")
   public String AddGRN(@RequestBody GRNEntity grn){
    //authentiction and autherzation
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"GRN");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        try {
             //set AutoGenarated Value
             String nextNumber=daoGRN.getNextGRNCode();

             //if next employee number is not come then set manualy last number+1
             if(nextNumber==null){
                 grn.setGrncode("GRN0001");
             }else{
                 grn.setGrncode(nextNumber);
             }

            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            grn.setAddeduser(addedUserData.getId());

            grn.setAddeddate(LocalDateTime.now());

            for(GRNItemEntity grnitem:grn.getGrn_item()){
                grnitem.setGrn_id((grn));
            }

            for(SerialNoListEntity serialNoList:grn.getSerial_no_list()){
                serialNoList.setGrn_id((grn));
                //category value get
                serialNoList.getCategory_id();
                //itemid
                serialNoList.getItemcode();
            }

            daoGRN.save(grn);

            return "OK";

        } catch (Exception e) {
            return "Save not Completed: "+e.getMessage();
        }

   }


   @DeleteMapping(value = "/grn")
   public String DeleteGRN(@RequestBody GRNEntity grn){
       //Autherntication and autherization
       Authentication authentication =SecurityContextHolder.getContext().getAuthentication();
       HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "GRN");
   
       
       if(!userPrivilage.get("delete")){
           return "Permission Denied! Delete not Completed";
       }

       GRNEntity extGRN=daoGRN.getReferenceById(grn.getId());
      if(extGRN==null){
       return "Delete not Completed.GRN not exists";
      }

      try {
       UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
       grn.setDeleteuser(deleteUser.getId());

       grn.setDeletedate(LocalDateTime.now());

       grn.setGrnstatus_id(daoGRNStatus.getReferenceById(3));

       daoGRN.save(grn);

       return "OK";
      } catch (Exception e) {
       return "Delete not completed. "+e.getMessage();
      }
   }

   @PutMapping(value = "/grn")
    public String updatePurchaseRequest(@RequestBody GRNEntity grn) {
       
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"GRN");

        if(!userPrivilage.get("update")){
            return "Permission Denied! Update not Completed";
        }

        GRNEntity extGRN=daoGRN.getReferenceById(grn.getId());
        if(extGRN==null){
         return "Delete not Completed.GRN not exists";
        }
      


        try {
            //asign update user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            grn.setModifyuser(modifyUser.getId());

            //assign update date
            grn.setModifydate(LocalDateTime.now());

            for(GRNItemEntity grnitem:grn.getGrn_item()){
                grnitem.setGrn_id((grn));
            }

            //save the data
            daoGRN.save(grn);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed."+e.getMessage();
        }
    }


}
