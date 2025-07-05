package lk.bytetechsolution.Entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer_payment") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//default constructor       ----usefull when create object that not have any initial values
@NoArgsConstructor//all argument constructor  ----usefull when create object that have any initial values
public class CustomerPaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @NotNull
    @Column(name = "paymentno",unique = true)
    private String paymentno;

    @NotNull
    @Column(name = "totalamount",unique = true)
    private BigDecimal totalamount;

    @NotNull
    @Column(name = "paidamount",unique = true)
    private BigDecimal paidamount;

    @NotNull
    @Column(name = "balance",unique = true)
    private BigDecimal balance;

     @NotNull
    @Column(name = "addeddate")
    private LocalDateTime addeddate;

    @Column(name = "modifydate")
    private LocalDateTime modifydate;
    
    @Column(name = "deletedate")
    private LocalDateTime deletedate;

    @NotNull
    @Column(name = "addeduser")
    private Integer addeduser;

    @Column(name = "modifyuser")
    private Integer modifyuser;

    @Column(name = "deleteuser")
    private Integer deleteuser;

    @ManyToOne  
    @JoinColumn(name="invoice_id",referencedColumnName = "id")
    private InvoiceEntity invoice_id;

    @ManyToOne  
    @JoinColumn(name="customer_id",referencedColumnName = "id")
    private CustomerEntity customer_id;

    @ManyToOne  
    @JoinColumn(name="paymenttype_id",referencedColumnName = "id")
    private PaymentTypeEntity paymenttype_id;

    @ManyToOne  
    @JoinColumn(name="invoicestatus_id",referencedColumnName = "id")
    private InvoiceStatusEntity invoicestatus_id;
   
}
