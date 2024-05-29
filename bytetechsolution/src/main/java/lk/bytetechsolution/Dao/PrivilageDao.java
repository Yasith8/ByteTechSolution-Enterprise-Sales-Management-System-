package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.PrivilageEntity;


public interface PrivilageDao extends JpaRepository<PrivilageEntity,Integer> {

    @Query("select p from PrivilageEntity p where p.role_id.id=?1 and p.module_id.id=?2")
    PrivilageEntity getPrivilagebyRoleAndModule(Integer moduleid,Integer roleid);
}
