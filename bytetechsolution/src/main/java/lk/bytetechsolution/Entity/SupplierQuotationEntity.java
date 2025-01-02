package lk.bytetechsolution.Entity;

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

@Entity//class convert into entity. in here java tell to system instance of this class represent rows in table in db
@Table(name = "supplier_quotation")//assign the table to the entity class. here map to the table
@Data// this data use to genarate getters and setters and toString to this class
@NoArgsConstructor//AllArgsConstructor annotation generates a constructor initializing all object fields.
@AllArgsConstructor//NoArgsConstructor generates a no-argument constructor for a class
public class SupplierQuotationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @NotNull
    @Column(name = "quotationid")
    private String quotationid;

    @NotNull
    @Column(name = "validdate")
    private LocalDateTime validdate;

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
    @JoinColumn(name = "quotation_request_id",referencedColumnName = "id")
    private QuotationRequestEntity quotation_request_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id",referencedColumnName = "id")
    private SupplierEntity supplier_id;

    @ManyToOne
    @JoinColumn(name = "quotationstatus_id",referencedColumnName = "id")
    private QuotationStatusEntity quotationstatus_id;

   @OneToMany(mappedBy = "supplier_quotation_id",cascade = CascadeType.ALL,orphanRemoval = true)
   private List<QuotationItemEntity> quotation_item;

}
