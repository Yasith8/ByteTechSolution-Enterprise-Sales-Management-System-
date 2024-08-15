package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.ModuleEntity;


import java.util.*;

/* 
 * modelueDao extended from jparepository
 * modelueDao inherit all the methods provides by  JPARepository for CRUD operations on EmployeeEntity
 * Integer spesify the type of primary key in moduleEntity is Integer
 */
public interface ModuleDao extends JpaRepository<ModuleEntity,Integer>{



    @Query("select m from ModuleEntity m where m.id not in (select p.module_id.id from PrivilageEntity p where p.role_id.id=?1)")
    public List<ModuleEntity> getModuleByPrivilageId(Integer roleId);

    @Query(value = "SELECT m.name FROM bytetechsolution.module m where m.id in (SELECT prv.module_id FROM bytetechsolution.privilage prv where prv.role_id in (SELECT uhr.role_id FROM bytetechsolution.user_has_role uhr where uhr.user_id in (SELECT u.id from bytetechsolution.user u where u.username=?1)) and prv.selprv=1)",nativeQuery = true)
    public String[] getModuleByLoggedUser(String username);
    
}
