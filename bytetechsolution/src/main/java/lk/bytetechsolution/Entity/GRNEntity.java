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

/* 
 * ------------Entity-----------
 * convert into entity class
 * Entity from JPA-Java Persistence API(also known as jakarta persistence api)
 * Entity used to mark class as a entity
 * java tell system to instance of this class will represent rows in db's table
 */
@Entity
@Table(name = "grn") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//AllArgsConstructor annotation generates a constructor initializing all object fields.
@NoArgsConstructor//NoArgsConstructor generates a no-argument constructor for a class
public class GRNEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    
    @NotNull
    @Column(name = "grncode",unique = true)
    private String grncode;

    @NotNull
    @Column(name = "totalamount")
    private BigDecimal totalamount;

    @NotNull
    @Column(name = "discountrate")
    private Integer discountrate;

    @NotNull
    @Column(name = "finalamount")
    private BigDecimal finalamount;

    @NotNull
    @Column(name = "paidamount")
    private BigDecimal paidamount;
    
    @Column(name = "note")
    private String note;

    @NotNull
    @Column(name = "reciveddate")
    private LocalDateTime reciveddate;

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
    @JoinColumn(name = "grnstatus_id",referencedColumnName = "id")
    private GRNStatusEntity grnstatus_id;

    @ManyToOne
    @JoinColumn(name = "purchase_request_id",referencedColumnName = "id")
    private PurchaseRequestEntity purchase_request_id;

    @OneToMany(mappedBy = "grn_id",cascade = CascadeType.ALL,orphanRemoval=true)
    private List<GRNItemEntity> grn_item;

     @OneToMany(mappedBy = "grn_id",cascade = CascadeType.ALL,orphanRemoval=true)
    private List<SerialNoListEntity> serial_no_list;


}
