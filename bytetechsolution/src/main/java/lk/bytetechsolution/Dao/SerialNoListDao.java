package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface SerialNoListDao extends JpaRepository<SerialNoListDao,Integer>{
    
}
