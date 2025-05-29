package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.SesonalDiscountDao;
import lk.bytetechsolution.Entity.SeasonalDiscountEntity;

@RestController
public class SeasonalDiscountController {
    @Autowired
    private SesonalDiscountDao dao;

    @GetMapping(value = "/seasonaldiscount/alldata",produces = "application/json")
    public List<SeasonalDiscountEntity> GetSeasonalDiscount(){
        return dao.findAll();
    }
}
