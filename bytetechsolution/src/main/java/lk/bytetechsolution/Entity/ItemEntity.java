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

    @Column(name = "itemcode",unique = true)
    @NotNull
    private String itemcode;

    @Column(name = "itemname",unique = true)
    @NotNull
    private String itemname;

    @Column(name = "salesprice")
    @NotNull
    private BigDecimal salesprice;

    @Column(name = "purchaseprice")
    @NotNull
    private BigDecimal purchaseprice;

    @Column(name = "rop")
    private int rop;

    @Column(name = "roq")
    private int roq;

    @Column(name = "addeddate")
    @NotNull
    private LocalDateTime addeddate;

    @Column(name = "modifydate")
    private LocalDateTime modifydate;

    @Column(name = "deletedate")
    private LocalDateTime deletedate;

    @Column(name = "quentity")
    @NotNull
    private Integer quentity;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photoname")
    private String photoname;

    @ManyToOne
    @JoinColumn(name = "addeduser_id", referencedColumnName = "id")
    private UserEntity addeduser_id;

    @ManyToOne
    @JoinColumn(name = "deleteuser_id", referencedColumnName = "id")
    private UserEntity deleteuser_id;

    @ManyToOne
    @JoinColumn(name = "modifyuser_id", referencedColumnName = "id")
    private UserEntity modifyuser_id;

    @ManyToOne
    @JoinColumn(name = "itemstatus_id", referencedColumnName = "id")
    private ItemStatusEntity itemstatus_id;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private CategoryEntity category_id;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private BrandEntity brand_id;

    public ItemEntity(int id,String itemcode,String itemname,BigDecimal salesprice,BigDecimal purchaseprice,int rop,int roq,int quentity,byte[] photo,String photoname,ItemStatusEntity itemstatus_id,CategoryEntity category_id,BrandEntity brand_id){
        this.id = id;
        this.itemcode=itemcode;
        this.itemname=itemname;
        this.salesprice=salesprice;
        this.purchaseprice=purchaseprice;
        this.rop=rop;
        this.roq=roq;
        this.quentity=quentity;
        this.photo=photo;
        this.photoname=photoname;
        this.itemstatus_id=itemstatus_id;
        this.brand_id=brand_id;
        this.category_id=category_id;
    }
}
