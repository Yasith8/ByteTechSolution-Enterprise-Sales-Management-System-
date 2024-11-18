package lk.bytetechsolution.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bytetechsolution.Dao.SerialNoListDao;
import lk.bytetechsolution.Entity.SerialNoListEntity;

@RestController
public class SerialNoListController {
    @Autowired
    private SerialNoListDao daoSerialNoList;

    @GetMapping(value = "/serialnolist/alldata",produces = "application/json")
    public List<SerialNoListEntity> getAllSerialNoList(){
        return daoSerialNoList.findAll();
    }
}
