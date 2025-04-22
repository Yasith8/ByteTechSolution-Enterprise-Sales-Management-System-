package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import lk.bytetechsolution.Dao.GRNStatusDao;
import lk.bytetechsolution.Entity.GRNStatusEntity;

public class GRNStatusController {
    @Autowired
    private GRNStatusDao dao;

    @GetMapping(value = "/grnstatus/alldata",produces = "application/json")
    public List<GRNStatusEntity> GetGrnStatus(){
        return dao.findAll();
    }
}
