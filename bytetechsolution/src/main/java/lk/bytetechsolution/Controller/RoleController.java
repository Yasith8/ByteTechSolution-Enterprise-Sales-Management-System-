package lk.bytetechsolution.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import lk.bytetechsolution.Dao.RoleDao;
import lk.bytetechsolution.Entity.RoleEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
public class RoleController {

    @Autowired
    private RoleDao dao;
    
    @GetMapping(value = "/role/listwithoutadmin",produces = "application/json")
    public List<RoleEntity> getRoleWithoutAdmin() {
        return dao.getListWithoutAdmin();
    }

     @GetMapping(value = "/role/rolebyusername/{username}",produces = "application/json")
    public List<RoleEntity> getRoleWithoutAdmin(@PathVariable String username) {
        return dao.getRolesByUserName(username);
    }

}
