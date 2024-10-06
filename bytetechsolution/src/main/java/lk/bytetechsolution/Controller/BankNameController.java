package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.BankNameDao;
import lk.bytetechsolution.Entity.BankNameEntity;

import java.util.*;

@RestController
public class BankNameController {
    @Autowired
    private BankNameDao dao;

    @GetMapping(value = "/bankname/alldata",produces = "application/json")
    public List<BankNameEntity> getBankNames(){
        return dao.findAll();
    }
}
