package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.PurchaseRequestEntity;

public interface PurchaseRequestDao extends JpaRepository<PurchaseRequestEntity,Integer>{

     @Query(value = "select concat('PRQ',lpad(substring(max(prq.requestcode),4)+1,4,'0')) as requestcode from bytetechsolution.purchase_request as prq",nativeQuery = true)
    String getNextPrequestCode();
    
}
