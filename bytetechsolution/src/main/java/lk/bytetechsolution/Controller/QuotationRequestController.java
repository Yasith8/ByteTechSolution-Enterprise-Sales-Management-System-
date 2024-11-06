package lk.bytetechsolution.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.QuotationRequestDao;
import lk.bytetechsolution.Dao.SupplierStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.QuotationRequestEntity;
import lk.bytetechsolution.Entity.SupplierEntity;
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

}
