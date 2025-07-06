package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.InvoiceDao;
import lk.bytetechsolution.Dao.InvoiceStatusDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class PreOrderController {
    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @RequestMapping(value = "/preorder")
    public ModelAndView GetPreOrderUI() {
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView preOrderView = new ModelAndView();
        // pass the ui
        preOrderView.setViewName("preorder.html");
        // attributes set to show titles in web page using theamleaf
        preOrderView.addObject("title", "Pre-Order Management || Bytetech Solution");
        preOrderView.addObject("user", authentication.getName());// passing logged user name
        preOrderView.addObject("EmpName", loggedEmployee);
        preOrderView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        preOrderView.addObject("LoggedUserPhoto", loggedUser.getPhoto()); 

        return preOrderView;
    }
}
