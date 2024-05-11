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

import java.time.LocalDate;

/* 
 * ------------Entity-----------
 * convert into entity class
 * Entity from JPA-Java Persistence API(also known as jakarta persistence api)
 * Entity used to mark class as a entity
 * java tell system to instance of this class will represent rows in db's table
 */
@Entity
@Table(name="employee")  //spesify name of database to this entity(mapping with employee table)
@Data                    //genarate getters and setters and toString to class
@NoArgsConstructor       //default constructor       ----usefull when create object that not have any initial values
@AllArgsConstructor      //all argument constructor  ----usefull when create object that have any initial values
public class EmployeeEntity {


    @Id //integrate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  //set Auto Increment
    @Column(name = "id",unique = true)  //map with id column and set as unique
    private Integer id;

    @Column(name="empid",unique=true) //map with empid column and set as unique
    @NotNull                    // cannot be null
    private String empid;
    
    @Column(name="fullname") //map with fullname column
    @NotNull
    private String fullname;

    @Column(name="callingname") //map with callingname column
    @NotNull
    private String callingname;

    @Column(name="nic",unique = true) //map with nic column and set as unique
    @NotNull
    private String nic;

    @Column(name="gender")  //map with gender column
    @NotNull
    private String gender;

    @Column(name="email")
    @NotNull
    private String email;

    @Column(name="mobile")
    @NotNull
    private String mobile;

    @Column(name="landno")
    private String landno;

    @Column(name="address")
    private String address;

    @Column(name="dob")
    private LocalDate dob;

    @Column(name="note")
    private String note;


    /* 
     * Map with Forign Keys
     * Relationship type : OneToOne, ManyToMany, OneToMany , ManyToOne
     * In this 2 forign keys are map with designationentity and employeestatusentity
     * one designation can have many employees .but one employee can have one designation(doctor or pharmesist)
     * one employeestatus can have many employees but one employee can  only have one employeestatus (active or resign)
     */
    @ManyToOne  
    @JoinColumn(name="designation_id",referencedColumnName = "id")
    private DesignationEntity designation_id;

    @ManyToOne
    @JoinColumn(name="employeestatus_id",referencedColumnName = "id")
    private EmployeeStatusEntity employeestatus_id;
}
