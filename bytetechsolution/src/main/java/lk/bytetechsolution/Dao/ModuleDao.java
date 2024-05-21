package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.ModuleEntity;
import lk.bytetechsolution.Entity.PrivilageEntity;

import java.util.*;

/* 
 * modelueDao extended from jparepository
 * modelueDao inherit all the methods provides by  JPARepository for CRUD operations on EmployeeEntity
 * Integer spesify the type of primary key in moduleEntity is Integer
 */
public interface ModuleDao extends JpaRepository<ModuleEntity,Integer>{


   /*  @Query("select m from ModuleEntitiy m from where m.id not in (select p.module_id.id from PrivilageEntity p where p.role_id.id=?1)")
    List<ModuleEntity> getModuleByPrivilageId(Integer roleId);
     */
}
