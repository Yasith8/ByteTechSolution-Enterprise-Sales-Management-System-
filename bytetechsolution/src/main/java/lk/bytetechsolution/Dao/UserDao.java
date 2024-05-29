package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.UserEntity;


/* 
 * EmployeeDao extended from jparepository
 * EmployeeDao inherit all the methods provides by  JPARepository for CRUD operations on EmployeeEntity
 * Integer spesify the type of primary key in EmployeeEntity is Integer
 */

public interface UserDao extends JpaRepository<UserEntity,Integer>{


     // Query
    /*
     * 1. Native Query
     * native are not included in JPA
     * some native queries are ot available in JPA
     * 
     * 2.JPA Query --default
     */


    @Query("select u from UserEntity u where u.email=?1") 
    public UserEntity getByEmail(String email);
    
    @Query("select u from UserEntity u where u.username=?1") 
    public UserEntity getByUsername(String username);   
}
