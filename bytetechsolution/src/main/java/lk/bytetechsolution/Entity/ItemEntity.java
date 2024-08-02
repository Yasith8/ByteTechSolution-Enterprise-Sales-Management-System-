package lk.bytetechsolution.Entity;

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
import java.math.*;
import java.time.LocalDateTime;;

@Entity
@Table(name = "item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "itemcode")
    @NotNull
    private String itemcode;

    @Column(name = "itemname")
    @NotNull
    private String itemname;

    @Column(name = "salesprice")
    @NotNull
    private BigDecimal salesprice;

    @Column(name = "purchaseprice")
    @NotNull
    private BigDecimal purchaseprice;

    @Column(name = "rop")
    @NotNull
    private String rop;

    @Column(name = "addeddate")
    @NotNull
    private LocalDateTime addeddate;

    @Column(name = "modifydate")
    private LocalDateTime modifydate;

    @Column(name = "deletedate")
    private LocalDateTime deletedate;

    @Column(name = "addeduser")
    @NotNull
    private UserEntity addeduser;

    @Column(name = "modifyuser")
    private UserEntity modifyuser;

    @Column(name = "deleteuser")
    private UserEntity deleteuser;

    @Column(name = "quentity")
    @NotNull
    private String quentity;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photoname")
    private String photoname;

    @ManyToOne
    @JoinColumn(name = "itemstatus_id", referencedColumnName = "id")
    private ItemStatusEntity itemstatus_id;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private CategoryEntity category_id;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private BrandEntity brand_id;
}
