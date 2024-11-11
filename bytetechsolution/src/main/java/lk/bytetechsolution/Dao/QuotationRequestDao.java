package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.QuotationRequestEntity;

/* 
 * This dao file extends from JpaRepositoy
 * JPA Repository CRUD and Pagination operations
 * crud save(),delete(),findAll(),findById()
 * pagination findAl()
 * can use for custom query methods
 */
public interface QuotationRequestDao extends JpaRepository<QuotationRequestEntity,Integer>{

    /* 
     * 1. max(quotationrequestcode) - find max value in db quotation request code
     * 2. substring(max(quotationrequestcode),4) - 1st 3 letters skip start with 4th character
     * 3. substring(max(quotationrequestcode),4)+1 - making new number here
     * 4. lpad(substring(max(qrc.quotationrequestcode),4)+1,4,'0') - make sure there are have 4 digits and adding beginning to there if number too short(lpad-leftpadding)
     * 5. concat('QRC',lpad(substring(max(qrc.quotationrequestcode),4)+1,4,'0')) - add QRC to first 3 charater
     */
    @Query(value ="select concat('QRC',lpad(substring(max(qrc.quotationrequestcode),4)+1,4,'0')) as quotationrequestcode from bytetechsolution.quotation_request as qrc",nativeQuery = true)
    public String getNextQuotationRequestCode();
    
}
