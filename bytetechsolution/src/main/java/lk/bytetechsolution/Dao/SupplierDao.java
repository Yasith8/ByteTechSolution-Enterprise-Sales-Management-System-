package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import lk.bytetechsolution.Entity.SupplierEntity;

public interface SupplierDao extends JpaRepository<SupplierEntity,Integer>{

    @Query("select e from SupplierEntity e where e.email=?1")
     public SupplierEntity getByEmail(String email);

    @Query(value = "select concat('SUP',lpad(substring(max(sup.supplierid),4)+1,4,'0')) as supplierid from bytetechsolution.supplier as sup",nativeQuery = true)
    public String getNextSupplierNumber();
} 
