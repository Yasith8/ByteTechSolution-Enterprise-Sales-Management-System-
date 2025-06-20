package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.GRNEntity;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface GRNDao extends JpaRepository<GRNEntity,Integer>{
    @Query(value = "select concat('GRN',lpad(substring(max(grn.grncode),4)+1,4,'0')) as grncode from bytetechsolution.grn as grn",nativeQuery = true)
    String getNextGRNCode();
    
   
}
