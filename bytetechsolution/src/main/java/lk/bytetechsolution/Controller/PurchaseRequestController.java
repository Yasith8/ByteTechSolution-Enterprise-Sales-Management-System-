package lk.bytetechsolution.Controller;


import java.util.*;
import java.time.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.PurchaseRequestDao;
import lk.bytetechsolution.Dao.PurchaseStatusDao;
import lk.bytetechsolution.Dao.SupplierQuotationDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.PurchaseRequestEntity;
import lk.bytetechsolution.Entity.PurchaseRequestItemEntity;
import lk.bytetechsolution.Entity.UserEntity;
/*
* implemented mapping to available for use  
* add implemented mapping to servelet container for use
* fundemental component for build REST full api  (representational state transfer)
* restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
*/
@RestController
public class PurchaseRequestController {
     /* 
     * AutoWired used for automatic dependency injection
     * inject memorytype Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private PurchaseRequestDao daoPurchaseRequest;

    @Autowired
    private PurchaseStatusDao daoPurchaseStatus;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;


    @Autowired
    private PrivilageController privilageController;

    @RequestMapping(value = "/purchaserequest")
    public ModelAndView GetPurchaseRequestUI(){
         //get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user detail
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();

        //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView purchaseRequestView=new ModelAndView();
        //pass the ui
        purchaseRequestView.setViewName("purchaserequest.html");
        //attributes set to show titles in web page using theamleaf
        purchaseRequestView.addObject("title", "Purchase Request Management || Bytetech Solution");
        purchaseRequestView.addObject("user", authentication.getName());// passing logged user name
        purchaseRequestView.addObject("EmpName", loggedEmployee);
        purchaseRequestView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        purchaseRequestView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return purchaseRequestView;
    }

    @GetMapping(value="/purchaserequest/alldata",produces = "application/json")
    public List<PurchaseRequestEntity> GetPurchaseRequestData(){
        //Authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"PREQUEST");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<PurchaseRequestEntity>();
        }

        return daoPurchaseRequest.findAll();
    }

    @PostMapping(value = "/purchaserequest")
    public String AddPurchaseRequest(@RequestBody PurchaseRequestEntity prequest){
        //authentiction and autherzation
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"PREQUEST");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        try {

            //set AutoGenarated Value
            String nextNumber=daoPurchaseRequest.getNextPrequestCode();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                prequest.setRequestcode("PRC0001");
            }else{
                prequest.setRequestcode(nextNumber);
            }

            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            prequest.setAddeduser(addedUserData.getId());

            prequest.setAddeddate(LocalDateTime.now());


            for(PurchaseRequestItemEntity purchaseequestitem:prequest.getPurchase_request_item()){
                purchaseequestitem.setPurchase_request_id(prequest);
            }

            

            daoPurchaseRequest.save(prequest);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed: "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/purchaserequest")
    public String DeletePurchaseRequest(@RequestBody PurchaseRequestEntity prequest){
        //Autherntication and autherization
        Authentication authentication =SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(), "PREQUEST");
    
        
        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

       PurchaseRequestEntity extPurchaseRequest=daoPurchaseRequest.getReferenceById(prequest.getId());
       if(extPurchaseRequest==null){
        return "Delete not Completed.Purchase Request not exists";
       }

       try {
        UserEntity deleteUser=daoUser.getByUsername(authentication.getName());
        prequest.setDeleteuser(deleteUser.getId());

        prequest.setDeletedate(LocalDateTime.now());

        prequest.setPurchasestatus_id(daoPurchaseStatus.getReferenceById(3));

        daoPurchaseRequest.save(prequest);

        return "OK";
       } catch (Exception e) {
        return "Delete not completed. "+e.getMessage();
       }
    }

    @PutMapping(value = "/purchaserequest")
    public String updatePurchaseRequest(@RequestBody PurchaseRequestEntity prequest) {
       
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"PREQUEST");

        if(!userPrivilage.get("update")){
            return "Permission Denied! Update not Completed";
        }

        PurchaseRequestEntity extPurchaseRequest=daoPurchaseRequest.getReferenceById(prequest.getId());
        if(extPurchaseRequest==null){
         return "Delete not Completed.Purchase Request not exists";
        }
      


        try {
            //asign update user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            prequest.setModifyuser(modifyUser.getId());

            //assign update date
            prequest.setModifydate(LocalDateTime.now());

            for(PurchaseRequestItemEntity purchaseequestitem:prequest.getPurchase_request_item()){
                purchaseequestitem.setPurchase_request_id(prequest);
            }

            //save the data
            daoPurchaseRequest.save(prequest);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed."+e.getMessage();
        }
    }
    
    @GetMapping(value = "/purchaserequest/prequestbyrequireddate",produces = "application/json")
    public List<PurchaseRequestEntity> GetPurchaseRequestByRequiredDate() {
        //Authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"PREQUEST");


        //if current logged user doesnt have privilages show empty list
        if(!userPrivilage.get("select")){
            return new ArrayList<PurchaseRequestEntity>();
        }

        return daoPurchaseRequest.findPrequestByRequiredDate();
    }

}
