package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.EmployeeEntity;
//import java.util.List;
import java.util.List;


/* 
 * EmployeeDao extended from jparepository
 * EmployeeDao inherit all the methods provides by  JPARepository for CRUD operations on EmployeeEntity
 * Integer spesify the type of primary key in EmployeeEntity is Integer
 */
public interface EmployeeDao extends JpaRepository<EmployeeEntity, Integer> {

  

    // Query
    /*
     * 1. Native Query
     * native are not included in JPA
     * some native queries are ot available in JPA
     * 
     * 2.JPA Query --default
     */

     //TODO  need to know about e.nic?=1
     @Query("select e from EmployeeEntity e where e.nic=?1")
     public EmployeeEntity getByNic(String nic);

     @Query("select e from EmployeeEntity e where e.email=?1")
     public EmployeeEntity getByEmail(String email);

     @Query(value = "select concat('E',lpad(substring(max(e.empid),2)+1,4,'0')) as EmpId from bytetechsolution.employee as e",nativeQuery = true)
     public String getNextEmployeeNumber();

     @Query(value = "select e from EmployeeEntity e where e.id not in (select u.employee_id.id from UserEntity u)")
     public List<EmployeeEntity> getListWithoutUserAccount();


}
