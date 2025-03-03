package lk.bytetechsolution.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.QuotationRequestDao;
import lk.bytetechsolution.Dao.QuotationStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.QuotationRequestEntity;
import lk.bytetechsolution.Entity.QuotationRequestItemEntitiy;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class QuotationRequestController {
    
    @Autowired
    private QuotationRequestDao daoQuotationRequest;

    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private QuotationStatusDao daoQuotationStatus;

    @Autowired
    private PrivilageController privilageController;

    @RequestMapping(value = "/quotationrequest")
    public ModelAndView getQuotationRequestUI(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
         //get current log user
        UserEntity loggedUser=daoUser.getByUsername(authentication.getName());

        //current loggedemployee
        String loggedEmployee=daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView quotationRequestView=new ModelAndView();
        //pass the ui
        quotationRequestView.setViewName("quotationrequest.html");
        //attributes set to show titles in web page using theamleaf
        quotationRequestView.addObject("title", "Quotation Request Management || Bytetech Solution");
        quotationRequestView.addObject("user", authentication.getName());// passing logged user name
        quotationRequestView.addObject("EmpName", loggedEmployee);
        quotationRequestView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());//get the first role
        quotationRequestView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return quotationRequestView;
    }


    @GetMapping(value = "/quotationrequest/alldata",produces = "application/json")
    public List<QuotationRequestEntity> GetAllQuotationRequestData(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");
        
        if(!userPrivilage.get("select")){
            return new ArrayList<QuotationRequestEntity>();
        }
        return daoQuotationRequest.findAll();
    }
    
    @GetMapping(value = "/quotationrequest/withoutexpiredrequest",produces = "application/json")
    public List<QuotationRequestEntity> GetAvailableRequest(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");

        if(!userPrivilage.get("select")){
            return new ArrayList<QuotationRequestEntity>();
        }

        return daoQuotationRequest.findByAfterRequireddate();
    }

    @PostMapping(value = "/quotationrequest")
    public String addQuotationRequestData(@RequestBody QuotationRequestEntity quotationrequest){
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");

        if(!userPrivilage.get("insert")){
            return "Permission Denied! Save not Completed";
        }

        //check already existance
        //todo try to validate using date and product

        try {

            //set AutoGenarated Value
            String nextNumber=daoQuotationRequest.getNextQuotationRequestCode();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                quotationrequest.setQuotationrequestcode("QRC0001");
            }else{
                quotationrequest.setQuotationrequestcode(nextNumber);
            }

            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            quotationrequest.setAddeduser(addedUserData.getId());

            quotationrequest.setAddeddate(LocalDateTime.now());

            for(QuotationRequestItemEntitiy quotationRequestItem:quotationrequest.getQuotation_request_item()){
                quotationRequestItem.setQuotation_request_id(quotationrequest);
            }

            
            daoQuotationRequest.save(quotationrequest);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed: "+e.getMessage();
        }
    }

    @DeleteMapping(value = "/quotationrequest")
    public String deteleQuotationRequestData(@RequestBody QuotationRequestEntity quotationrequest){
        //authentication and autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");

        if(!userPrivilage.get("delete")){
            return "Permission Denied! Delete not Completed";
        }

        //check existance
        QuotationRequestEntity extQuotationRequest=daoQuotationRequest.getReferenceById(quotationrequest.getId());
        if(extQuotationRequest==null){
            return "Delete not Completed. Quotation Request not exist";
        }

        try {
            UserEntity addedUserData=daoUser.getByUsername(authentication.getName());
            quotationrequest.setDeleteuser(addedUserData.getId());

            quotationrequest.setDeletedate(LocalDateTime.now());

            quotationrequest.setQuotationstatus_id(daoQuotationStatus.getReferenceById(2));

            daoQuotationRequest.save(quotationrequest);
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed: "+e.getMessage();
        }
    }

    @PutMapping(value = "/quotationrequest")
    public String updateQuotationRequestData(@RequestBody QuotationRequestEntity quotationrequest) {
       
        //Authentication and Autherization
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> userPrivilage=privilageController.getPrivilageByUserModule(authentication.getName(),"QUOTATION");

        if(!userPrivilage.get("update")){
            return "Permission Denied! Update not Completed";
        }

        //check existance
        QuotationRequestEntity extQuotationRequest=daoQuotationRequest.getReferenceById(quotationrequest.getId());

        if(extQuotationRequest==null){
            return "Delete not Completed.Supplier not exists";
        }

        //bug ask about duplicate thing that need to be unique
       
        try {
            //asign update user
            UserEntity modifyUser=daoUser.getByUsername(authentication.getName());
            quotationrequest.setModifyuser(modifyUser.getId());

            //assign update date
            quotationrequest.setModifydate(LocalDateTime.now());

            for(QuotationRequestItemEntitiy quotationRequestItem:quotationrequest.getQuotation_request_item()){
                quotationRequestItem.setQuotation_request_id(quotationrequest);
            }

            //save the data
            daoQuotationRequest.save(quotationrequest);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed."+e.getMessage();
        }
    }

}
