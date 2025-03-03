package lk.bytetechsolution.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import lk.bytetechsolution.Dao.QuotationRequestDao;
import lk.bytetechsolution.Entity.QuotationRequestEntity;

public class SupplierSubmitController {
    @Autowired
    private QuotationRequestDao daoQuotationRequest;

    @GetMapping(value = "/quotationrequest/withoutexpiredrequest",produces = "application/json")
    public List<QuotationRequestEntity> GetAvailableRequest(){

        return daoQuotationRequest.findByAfterRequireddate();
    }

}
