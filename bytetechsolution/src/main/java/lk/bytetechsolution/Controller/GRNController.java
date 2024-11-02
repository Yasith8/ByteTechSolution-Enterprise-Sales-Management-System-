package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.CategoryDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.GRNDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.UserEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


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
    private CategoryDao daoCategory;

    @Autowired
    private PrivilageController privilageController;

   @RequestMapping(value = "/casing")
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





}
