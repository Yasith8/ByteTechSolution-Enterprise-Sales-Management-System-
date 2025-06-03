package lk.bytetechsolution.Entity;


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
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

/* 
 * ------------Entity-----------
 * convert into entity class
 * Entity from JPA-Java Persistence API(also known as jakarta persistence api)
 * Entity used to mark class as a entity
 * java tell system to instance of this class will represent rows in db's table
 */
@Entity
@Table(name = "supplier_payment_has_grn") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//AllArgsConstructor annotation generates a constructor initializing all object fields.
@NoArgsConstructor//NoArgsConstructor generates a no-argument constructor for a class
public class SupplierPaymentHasGRNEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @ManyToOne
    @JoinColumn(name = "grn_id",referencedColumnName = "id")
    private GRNEntity grn_id;

    @NotNull
    @Column(name = "grnamount")
    private BigDecimal grnamount;

    @NotNull
    @Column(name = "payedamount")
    private BigDecimal payedamount;

    @NotNull
    @Column(name = "dueamount")
    private BigDecimal dueamount;

    @ManyToOne
    @JoinColumn(name = "supplier_payment_id",referencedColumnName = "id")
    @JsonIgnore
    private SupplierPaymentEntity supplier_payment_id;
}
