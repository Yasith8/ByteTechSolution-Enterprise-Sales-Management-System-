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

/* 
 * ------------Entity-----------
 * convert into entity class
 * Entity from JPA-Java Persistence API(also known as jakarta persistence api)
 * Entity used to mark class as a entity
 * java tell system to instance of this class will represent rows in db's table
 */
@Entity
@Table(name = "serial_no_list") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//AllArgsConstructor annotation generates a constructor initializing all object fields.
@NoArgsConstructor//NoArgsConstructor generates a no-argument constructor for a class
public class SerialNoListEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @NotNull
    @Column(name = "serialno")
    private String serialno;

    @NotNull
    @Column(name = "status")
    private Boolean status;

    @NotNull
    @Column(name = "itemcode")
    private String itemcode;

    @NotNull
    @Column(name = "itemname")
    private String itemname;

    @ManyToOne
    @JoinColumn(name = "category_id",referencedColumnName = "id")
    private CategoryEntity category_id;

    
    @ManyToOne
    @JoinColumn(name = "grn_id",referencedColumnName = "id")
    private GRNEntity grn_id;
}
