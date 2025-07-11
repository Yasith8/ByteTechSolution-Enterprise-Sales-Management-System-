package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.InvoiceEntity;

public interface SalesSummaryDao extends JpaRepository<InvoiceEntity,Integer>{
    @Query(value="SELECT monthname(i.addeddate), sum(i.totalamount) FROM bytetechsolution.invoice as i where i.addeddate -interval 6 month group by monthname(i.addeddate);",nativeQuery = true)
    String[][] getPaymentByPrevSixMonth();
    
    @Query(value="SELECT monthname(i.addeddate),count(i.id), sum(i.totalamount) FROM bytetechsolution.invoice as i where i.addeddate between ?1 and ?2 group by monthname(i.addeddate);",nativeQuery = true)
    String[][] getPaymentByGivenDateMonthlyRange(String startdate,String enddate);
    
    @Query(value="SELECT week(i.addeddate),count(i.id), sum(i.totalamount) FROM bytetechsolution.invoice as i where i.addeddate between ?1 and ?2 group by week(i.addeddate);",nativeQuery = true)
    String[][] getPaymentByWeeklyRange(String startdate,String enddate);
    
    @Query(value="SELECT * FROM bytetechsolution.invoice i where i.balance=0 and i.addeddate -interval 30 day;",nativeQuery = true)
    String[][] getLast30daysCompletedOrders();
    
    @Query(value="select sum(i.totalamount) FROM bytetechsolution.invoice as i where i.addeddate -interval 30 day group by monthname(i.addeddate)",nativeQuery = true)
    String[][] getPaymentByThirtyDays();
    
    @Query(value="SELECT * FROM bytetechsolution.invoice i where i.balance!=0 and i.addeddate -interval 30 day;",nativeQuery = true)
    String[][] getLast30daysPendingOrders();

    @Query(value="SELECT count(c.id) FROM bytetechsolution.customer c where c.addeddate -interval 30 day;",nativeQuery = true)
    String getLast30daysTotalCustomers();
    
    @Query(value="SELECT date(i.addeddate),sum(i.totalamount) FROM bytetechsolution.invoice i where i.addeddate -interval 7 day group by date(i.addeddate);",nativeQuery = true)
    String[][] getLast7DaysSales();
}
