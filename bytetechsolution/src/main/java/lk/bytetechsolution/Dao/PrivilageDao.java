package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.PrivilageEntity;


public interface PrivilageDao extends JpaRepository<PrivilageEntity,Integer> {

    @Query("select p from PrivilageEntity p where p.role_id.id=?1 and p.module_id.id=?2")
    PrivilageEntity getPrivilagebyRoleAndModule(Integer roleid,Integer moduleid);

    @Query(value = "SELECT bit_or(p.selprv) as sel, bit_or(p.insprv) as ins, bit_or(delprv) as del, bit_or(updprv) as upd FROM bytetechsolution.privilage as p WHERE p.module_id in(SELECT m.id FROM bytetechsolution.module as m WHERE m.name=?2) AND p.role_id in (SELECT uhr.role_id FROM bytetechsolution.user_has_role as uhr WHERE uhr.user_id in(SELECT u.id from bytetechsolution.user as u WHERE u.username=?1));",nativeQuery = true)
    public String getPrivilageByUserModule(String username,String modulename);
}
