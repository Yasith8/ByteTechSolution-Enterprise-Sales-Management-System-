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
@Table(name = "customer") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//default constructor       ----usefull when create object that not have any initial values
@NoArgsConstructor//all argument constructor  ----usefull when create object that have any initial values
public class CustomerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @Column(name = "name",unique = true)
    @NotNull
    private String name;

    @Column(name = "mobile",unique = true)
    @NotNull
    private String mobile;

    @Column(name = "email",unique = true)
    @NotNull
    private String email;

    @Column(name = "address",unique = true)
    private String address;

    @Column(name = "totalpurchase",unique = true)
    @NotNull
    private BigDecimal totalpurchase;

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
    @JoinColumn(name = "customerstatus_id",referencedColumnName ="id" )
    private CustomerStatusEntity customerstatus_id;
}
