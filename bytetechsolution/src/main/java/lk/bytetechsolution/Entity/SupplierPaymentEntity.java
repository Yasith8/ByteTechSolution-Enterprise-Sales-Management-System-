package lk.bytetechsolution.Entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/* 
 * ------------Entity-----------
 * convert into entity class
 * Entity from JPA-Java Persistence API(also known as jakarta persistence api)
 * Entity used to mark class as a entity
 * java tell system to instance of this class will represent rows in db's table
 */
@Entity
@Table(name = "supplier_payment") // map the modularity table
@Data // genarate getters and setters and toString to class
@AllArgsConstructor // AllArgsConstructor annotation generates a constructor initializing all object
                    // fields.
@NoArgsConstructor // NoArgsConstructor generates a no-argument constructor for a class
public class SupplierPaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // set Auto Increment
    @Column(name = "id", unique = true)
    private int id;

    @NotNull
    @Column(name = "paymentno")
    private String paymentno;

    @NotNull
    @Column(name = "totaldueamount")
    private BigDecimal totaldueamount;

    @NotNull
    @Column(name = "payedamount")
    private BigDecimal payedamount;

    @NotNull
    @Column(name = "newdueamount")
    private BigDecimal newdueamount;

    @Column(name = "chequeno")
    private BigDecimal chequeno;

    @Column(name = "checkdate")
    private LocalDate checkdate;

    @Column(name = "transferno")
    private String transferno;

    @Column(name = "transferdatetime")
    private LocalDate transferdatetime;

    @NotNull
    @Column(name = "addeduser")
    private Integer addeduser;

    @NotNull
    @Column(name = "addeddate")
    private LocalDateTime addeddate;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private SupplierEntity supplier_id;

    @ManyToOne
    @JoinColumn(name = "paymenttype_id", referencedColumnName = "id")
    private PaymentTypeEntity paymenttype_id;

    @OneToMany(mappedBy = "supplier_payment_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplierPaymentHasGRNEntity> supplier_payment_has_grn;
}
