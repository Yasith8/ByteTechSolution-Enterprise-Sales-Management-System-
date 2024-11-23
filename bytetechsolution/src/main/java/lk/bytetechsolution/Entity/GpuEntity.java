package lk.bytetechsolution.Entity;

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
@Table(name = "gpu") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//default constructor       ----usefull when create object that not have any initial values
@NoArgsConstructor//all argument constructor  ----usefull when create object that have any initial values
public class GpuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private Integer id;

    @NotNull
    @Column(name = "itemcode",unique = true)
    private String itemcode;

    @NotNull
    @Column(name = "itemname",unique = true)
    private String itemname;

  
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


    
      /* 
     * Map with Forign Keys
     * Relationship type : OneToOne, ManyToMany, OneToMany , ManyToOne
     * In this 2 forign keys are map with designationentity and employeestatusentity
     * one designation can have many employees .but one employee can have one designation(doctor or pharmesist)
     * one employeestatus can have many employees but one employee can  only have one employeestatus (active or resign)
     */

     
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
     @JoinColumn(name="interface_id",referencedColumnName = "id")
     private InterfaceEntity interface_id;

     @ManyToOne  
     @JoinColumn(name="gpuchipset_id",referencedColumnName = "id")
     private GpuChipsetEntity gpuchipset_id;

     @ManyToOne  
     @JoinColumn(name="gpuseries_id",referencedColumnName = "id")
     private GpuSeriesEntity gpuseries_id;

     @ManyToOne  
     @JoinColumn(name="gputype_id",referencedColumnName = "id")
     private GpuTypeEntity gputype_id;

     @ManyToOne  
     @JoinColumn(name="capacity_id",referencedColumnName = "id")
     private CapacityEntity capacity_id;

     public GpuEntity(Integer id,String itemcode,String itemname,CategoryEntity category_id){
      this.id = id;
      this.itemcode=itemcode;
      this.itemname=itemname;
      this.category_id=category_id;
     }

}
