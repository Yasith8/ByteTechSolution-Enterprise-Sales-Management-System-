package lk.bytetechsolution.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;
import java.time.LocalDateTime;

/* 
 * ------------Entity-----------
 * convert into entity class
 * Entity from JPA-Java Persistence API(also known as jakarta persistence api)
 * Entity used to mark class as a entity
 * java tell system to instance of this class will represent rows in db's table
 */
@Entity
@Table(name = "user")       //spesify name of database to this entity(mapping with user table)
@Data                      //genarate getters and setters and toString to class
@NoArgsConstructor        //default constructor       ----usefull when create object that not have any initial values
@AllArgsConstructor      //all argument constructor  ----usefull when create object that have any initial values
public class UserEntity {
    
    @Id   //integrate primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)   //set Auto Increment
    @Column(name = "id",unique = true)       //map with id column and set as unique
    private Integer id;

    @Column(name="username")
    @NotNull
    private String username;

    @Column(name="password")
    @NotNull
    private String password;

    @Column(name="email")
    @NotNull
    private String email;

    @Column(name="photopath")
    private String photopath;

    @Column(name="added_datetime")
    @NotNull
    private LocalDateTime added_datetime;

    @Column(name="status")
    @NotNull
    private Boolean status;


     /* 
     * Map with Forign Keys
     * Relationship type : OneToOne, ManyToMany, OneToMany , ManyToOne
     * In this 2 forign keys are map with designationentity and employeestatusentity
     * one designation can have many employees .but one employee can have one designation(doctor or pharmesist)
     * one employeestatus can have many employees but one employee can  only have one employeestatus (active or resign)
     */
    @ManyToOne
    @JoinColumn(name = "employee_id",referencedColumnName = "id")
    private EmployeeEntity employee_id;

    @ManyToMany
    @JoinTable(name = "user_has_role",joinColumns=@JoinColumn(name="user_id"),inverseJoinColumns =@JoinColumn(name = "role_id"))
    private Set<RoleEntity> roles;
}
