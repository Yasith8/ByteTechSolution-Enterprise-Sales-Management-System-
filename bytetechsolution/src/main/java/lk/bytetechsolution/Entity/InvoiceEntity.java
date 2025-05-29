package lk.bytetechsolution.Entity;

import java.math.BigDecimal;
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

@Entity
@Table(name = "invoice") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//AllArgsConstructor annotation generates a constructor initializing all object fields.
@NoArgsConstructor//NoArgsConstructor generates a no-argument constructor for a class
public class InvoiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @NotNull
    @Column(name = "invoiceno",unique = true)
    private String invoiceno;

     @NotNull
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @NotNull
    @Column(name = "finalamount")
    private BigDecimal finalamount;
    
    @NotNull
    @Column(name = "paidamount")
    private BigDecimal paidamount;
    
    @Column(name = "balance")
    @NotNull
    private BigDecimal balance;



    @Column(name="addeddate")
    @NotNull
    private LocalDateTime addeddate;

    @Column(name="modifydate")
    private LocalDateTime modifydate;

    @Column(name="deletedate")
    private LocalDateTime deletedate;

    
    @Column(name = "addeduser")
    @NotNull
    private int addeduser;

    @Column(name = "modifyuser")
    private int modifyuser;
    
    @Column(name = "deleteuser")
    private int deleteuser;

    @ManyToOne
    @JoinColumn(name = "invoicestatus",referencedColumnName = "id")
    private InvoiceStatusEntity invoicestatus;

    @ManyToOne
    @JoinColumn(name = "seasonaldiscount",referencedColumnName = "id")
    private SeasonalDiscountEntity seasonaldiscount;

     @OneToMany(mappedBy = "invoice_id",cascade = CascadeType.ALL,orphanRemoval=true)
    private List<InvoiceItemEntity> invoice_item;
}
