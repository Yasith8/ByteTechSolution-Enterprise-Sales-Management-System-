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

/* 
 * ------------Entity-----------
 * convert into entity class
 * Entity from JPA-Java Persistence API(also known as jakarta persistence api)
 * Entity used to mark class as a entity
 * java tell system to instance of this class will represent rows in db's table
 */
@Entity
@Table(name = "motherboard") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//default constructor       ----usefull when create object that not have any initial values
@NoArgsConstructor//all argument constructor  ----usefull when create object that have any initial values
public class MotherboardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @NotNull
    @Column(name = "itemcode",unique = true)
    private String itemcode;

    @NotNull
    @Column(name = "itemname",unique = true)
    private String itemname;

    @NotNull
    @Column(name = "salesprice")
    private BigDecimal salesprice;

    @NotNull
    @Column(name = "purchaseprice")
    private BigDecimal purchaseprice;

    @NotNull
    @Column(name = "profitrate")
    private Integer profitrate;

    @Column(name = "rop")
    private Integer rop;

    @Column(name = "roq")
    private Integer roq;

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

    @NotNull
    @Column(name = "warranty")
    private Integer warranty;

    @Column(name = "description")
    private String description;

    ///////////////////////////////////////////
    //////////////Unique Parts////////////////
    /////////////////////////////////////////

    @NotNull
    @Column(name = "maxcapacity")
    private Integer maxcapacity;


      /* 
     * Map with Forign Keys
     * Relationship type : OneToOne, ManyToMany, OneToMany , ManyToOne
     * In this 2 forign keys are map with designationentity and employeestatusentity
     * one designation can have many employees .but one employee can have one designation(doctor or pharmesist)
     * one employeestatus can have many employees but one employee can  only have one employeestatus (active or resign)
     */

     @ManyToOne  
     @JoinColumn(name="cpusocket_id",referencedColumnName = "id")
     private CpuSocketEntity cpusocket_id;
 
     @ManyToOne  
     @JoinColumn(name="brand_id",referencedColumnName = "id")
     private BrandEntity brand_id;
 
     @ManyToOne  
     @JoinColumn(name="category_id",referencedColumnName = "id")
     private CategoryEntity category_id;
 
     @ManyToOne  
     @JoinColumn(name="itemstatus_id",referencedColumnName = "id")
     private ItemStatusEntity itemstatus_id;

     @ManyToOne  
     @JoinColumn(name="motherboardformfactor_id",referencedColumnName = "id")
     private MotherBoardFormFactorEntity motherboardformfactor_id;

     @ManyToOne  
     @JoinColumn(name="motherboardseries_id",referencedColumnName = "id")
     private MotherboardSeriesEntity motherboardseries_id;

     @ManyToOne  
     @JoinColumn(name="motherboardtype_id",referencedColumnName = "id")
     private MotherboardTypeEntity motherboardtype_id;

     @ManyToOne  
     @JoinColumn(name="memorytype_id",referencedColumnName = "id")
     private MemoryTypeEntity memorytype_id;

}
