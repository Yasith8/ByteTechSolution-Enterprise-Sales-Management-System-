package lk.bytetechsolution.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import lk.bytetechsolution.Dao.QuotationStatusDao;
import lk.bytetechsolution.Entity.QuotationStatusEntity;

import org.springframework.web.bind.annotation.GetMapping;



/* 
 * @RestController is a specialized version of @Controller, combining @Controller and @ResponseBody to simplify RESTful API development.
 * It allows Spring Boot to automatically detect implementation classes through classpath scanning
 * add implemented mapping to servelet container for use
 * fundemental component for build REST full api  (representational state transfer)
 * restcontroller tell spingboot to class/methods responsible to handle incoming http requests and produce appropiate http response(using json,xml format)
 */
@RestController
public class QuotationStatusController {
    @Autowired
    private QuotationStatusDao daoQuotationStatus;

    
    @GetMapping(value = "/quotationstatus/alldata",produces = "application/json")
    public List<QuotationStatusEntity> allQuotationStatusData(){
        return daoQuotationStatus.findAll();
    }
}
