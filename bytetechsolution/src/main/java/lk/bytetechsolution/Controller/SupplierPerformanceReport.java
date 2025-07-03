package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class SupplierPerformanceReport {
     @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    
    @RequestMapping(value = "/supplierperformancereport")
    public ModelAndView GetSalesReportUI() {
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView supplierPerformanceReportView = new ModelAndView();
        // pass the ui
        supplierPerformanceReportView.setViewName("supplierperformancereport.html");
        // attributes set to show titles in web page using theamleaf
        supplierPerformanceReportView.addObject("title", "Supplier Performance || Bytetech Solution");
        supplierPerformanceReportView.addObject("user", authentication.getName());// passing logged user name
        supplierPerformanceReportView.addObject("EmpName", loggedEmployee);
        supplierPerformanceReportView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        supplierPerformanceReportView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return supplierPerformanceReportView;
    }
}
