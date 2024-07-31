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


@Entity
@Table(name = "item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private int id;

    @Column(name = "itemcode",unique = true)
    @NotNull
    private String itemcode;

    @Column(name = "itemname") 
    @NotNull
    private String itemname;
   
    //todo  decimal
    @Column(name = "salesprice")
    @NotNull
    private String salesprice;
    
    //todo  decimal
   @Column(name = "purchaseprice")
   @NotNull
   private String purchaseprice; 
   
   @Column(name = "rop")
   @NotNull
   private String rop; 
   
   @Column(name = "addeddate")
   @NotNull
   private String addeddate;

   @Column(name = "quentity")
   @NotNull
   private String quentity; 


   @Column(name = "photo")
   private byte[] photo; 
   
   @Column(name = "photoname")
   private String photoname; 

   @Column(name = "itemstatus")
   @NotNull
   private String itemstatus;    

   @ManyToOne
   @JoinColumn(name = "category_id",referencedColumnName = "id")
   private CategoryEntity category_id;
   
   @ManyToOne
   @JoinColumn(name = "brand_id",referencedColumnName = "id")
   private BrandEntity brand_id;
}
