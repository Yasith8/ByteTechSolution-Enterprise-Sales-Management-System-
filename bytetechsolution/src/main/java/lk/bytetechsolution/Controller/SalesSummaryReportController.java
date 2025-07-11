package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.SalesSummaryDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class SalesSummaryReportController {
    /*
     * AutoWired used for automatic dependency injection
     * Autowired automatically injects an instance of a class where it’s needed,
     * without you having to create it manually
     * inject this Instance into dao variable
     * the method can use dao for save,retrive,maipulate motherboardformfactor data
     */
    @Autowired
    private UserDao daoUser;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private SalesSummaryDao daoSalesSummary;


    @RequestMapping(value = "/salessummaryreport")
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
        ModelAndView salesSummaryReportView = new ModelAndView();
        // pass the ui
        salesSummaryReportView.setViewName("salessummaryreport.html");
        // attributes set to show titles in web page using theamleaf
        salesSummaryReportView.addObject("title", "Sales Summary Report || Bytetech Solution");
        salesSummaryReportView.addObject("user", authentication.getName());// passing logged user name
        salesSummaryReportView.addObject("EmpName", loggedEmployee);
        salesSummaryReportView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        salesSummaryReportView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return salesSummaryReportView;
    }

     @GetMapping(value = "/report/salesdatabygivenrange",params = {"startdate","enddate","type"},produces = "application/json")
    public String[][] GetSalesdataByGivenRange(@RequestParam("startdate") String startdate,@RequestParam("enddate") String enddate,@RequestParam("type") String type){
            if(type.equals("Weekly")){
                return daoSalesSummary.getPaymentByWeeklyRange(startdate, enddate);
            }
            if(type.equals("Monthly")){
                return daoSalesSummary.getPaymentByGivenDateMonthlyRange(startdate, enddate);
            }
            //not null go when if not
            return null;
    }

     @GetMapping(value = "/report/salesbysixmonth",produces = "application/json")
    public String[][] GetSalesdataBySixMonth(){
            return daoSalesSummary.getPaymentByPrevSixMonth();
    }
}
