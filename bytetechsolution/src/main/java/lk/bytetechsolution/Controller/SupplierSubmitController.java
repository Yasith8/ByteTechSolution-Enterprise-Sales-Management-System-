package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.SupplierSubmitDao;

@RestController
public class SupplierSubmitController {
   
    @Autowired
    private SupplierSubmitDao supplierSubmitDao;

    @RequestMapping(value = "/suppliersubmitquotation",params = {"quotationreqestid","supplierid"},produces="application/json")
    public ModelAndView getSupplierSubmitQuotationUI(@RequestParam("quotationreqestid") String quotationReqestId,@RequestParam("supplierid") String supplierId){
        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView supplierQuotationView=new ModelAndView();
        //pass the ui
        supplierQuotationView.setViewName("supplierquotationsubmission.html");
        //attributes set to show titles in web page using theamleaf
        supplierQuotationView.addObject("title", "Supplier Quotation Submission || Bytetech Solution");

        return supplierQuotationView;

    }


}