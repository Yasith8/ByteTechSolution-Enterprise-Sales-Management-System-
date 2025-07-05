package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.PaymentTypeDao;
import lk.bytetechsolution.Entity.PaymentTypeEntity;

@RestController
public class PaymentTypeController {
    @Autowired
    private PaymentTypeDao daoPaymentType;

    @GetMapping(value = "/paymenttype/alldata", produces ="application/json" ) 
    public List<PaymentTypeEntity> allPaymentTypeData() {

        return daoPaymentType.findAll();
    }
}
