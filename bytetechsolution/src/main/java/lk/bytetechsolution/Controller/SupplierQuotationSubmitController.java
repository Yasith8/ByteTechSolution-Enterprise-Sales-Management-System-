package lk.bytetechsolution.Controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.SupplierQuotationDao;
import lk.bytetechsolution.Entity.QuotationItemEntity;
import lk.bytetechsolution.Entity.SupplierQuotationEntity;

@RestController
public class SupplierQuotationSubmitController {
   
    @Autowired
    private SupplierQuotationDao daoSupplierQuotation;

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

     @PostMapping(value = "/suppliersubmitquotation")
    public String addSupplierQuotationData(@RequestBody SupplierQuotationEntity supplierquotation){

        try {

            //set AutoGenarated Value
            String nextNumber=daoSupplierQuotation.getNextSupplierQuotationNumber();

            //if next employee number is not come then set manualy last number+1
            if(nextNumber==null){
                supplierquotation.setQuotationid("SQC0001");
            }else{
                supplierquotation.setQuotationid(nextNumber);
            }

            supplierquotation.setAddeddate(LocalDateTime.now());

            for(QuotationItemEntity quotationItem:supplierquotation.getQuotation_item()){
                quotationItem.setSupplier_quotation_id(supplierquotation);
            }
            daoSupplierQuotation.save(supplierquotation);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed: "+e.getMessage();
        }
    }


}