package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.QuotationRequestDao;
import lk.bytetechsolution.Entity.QuotationRequestEntity;

@RestController
public class QuotationRequestSubmitController {
    @Autowired
    private QuotationRequestDao daoQuotationRequest;

    @GetMapping(value = "/quotationrequestsubmit/requestbyid",params = {"id"},produces = "application/json")
    public QuotationRequestEntity GetQuotationRequestDataById(@RequestParam("id") Integer id){
        return daoQuotationRequest.findById(id).get();
    }
}
