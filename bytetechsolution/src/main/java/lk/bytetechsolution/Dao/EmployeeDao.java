package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.EmployeeEntity;
import lk.bytetechsolution.Entity.UserEntity;

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

     //use to get employee by nic no
     @Query("select e from EmployeeEntity e where e.nic=?1")
     public EmployeeEntity getByNic(String nic);
     
     //use to get employee by gmail address
     @Query("select e from EmployeeEntity e where e.email=?1")
     public EmployeeEntity getByEmail(String email);
     
     //use to get employee fullname by user id
     @Query(value = "SELECT e.fullname FROM bytetechsolution.employee e where e.id=(select u.employee_id from bytetechsolution.user u where u.id=?1)",nativeQuery = true)
     public String getFullnameById(int user);
     
     //use to get employee designation by user id
     @Query(value="SELECT d.name FROM bytetechsolution.designation d where d.id=(SELECT e.designation_id FROM bytetechsolution.employee e where e.id=(select u.employee_id from user u where u.id=6))",nativeQuery = true)
     public String getDesignationByUserId(int user);

     //auto generate employee number automatically
     @Query(value = "select concat('E',lpad(substring(max(e.empid),2)+1,4,'0')) as EmpId from bytetechsolution.employee as e",nativeQuery = true)
     public String getNextEmployeeNumber();

     //get employee list without 
     @Query(value = "select e from EmployeeEntity e where e.id not in (select u.employee_id.id from UserEntity u)")
     public List<EmployeeEntity> getListWithoutUserAccount();


}
