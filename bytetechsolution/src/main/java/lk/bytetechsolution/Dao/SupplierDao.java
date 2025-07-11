package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import lk.bytetechsolution.Entity.SupplierEntity;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface SupplierDao extends JpaRepository<SupplierEntity,Integer>{

    @Query("select e from SupplierEntity e where e.email=?1")
     public SupplierEntity getByEmail(String email);

    @Query(value = "select concat('SUP',lpad(substring(max(sup.supplierid),4)+1,4,'0')) as supplierid from bytetechsolution.supplier as sup",nativeQuery = true)
    public String getNextSupplierNumber();


    @Query(value="select * from bytetechsolution.supplier s where s.id in (select shc.supplier_id from bytetechsolution.supplier_has_brand_category shc where shc.category_id in (select c.id from bytetechsolution.category c where c.id=?1) and shc.brand_id in (select b.id from bytetechsolution.brand b where b.id=?2))", nativeQuery = true)
    public List<SupplierEntity> getSupplierByBrandCategory(Integer categoryid,Integer brandid);
    
    @Query(value="select * from bytetechsolution.supplier s where s.supplierstatus_id=1", nativeQuery = true)
    public List<SupplierEntity> getActiveSuppliers();
    
    
    @Query(value="select * from bytetechsolution.supplier as s where s.id in (select qrs.supplier_id from bytetechsolution.quotation_request_has_supplier as qrs where qrs.quotation_request_id in (select qr.id FROM bytetechsolution.quotation_request as qr where qr.id=?1 and qr.requireddate > date(now())));", nativeQuery = true)
    public List<SupplierEntity> getQRequestSupplier(Integer requestId);
} 


