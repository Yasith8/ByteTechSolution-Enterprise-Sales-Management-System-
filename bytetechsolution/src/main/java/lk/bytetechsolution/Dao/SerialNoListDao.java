package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.SerialNoListEntity;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface SerialNoListDao extends JpaRepository<SerialNoListEntity,Integer>{
     @Query(value = "select concat('SNL',lpad(substring(max(sno.serialno),4)+1,4,'0')) as serialno from bytetechsolution.serial_no_list as sno",nativeQuery = true)
    String getNextASCSeriealNo();
}
