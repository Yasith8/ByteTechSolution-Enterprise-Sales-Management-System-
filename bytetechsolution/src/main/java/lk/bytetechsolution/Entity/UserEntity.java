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


@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    @NotNull
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

    @ManyToOne
    @JoinColumn(name = "employee_id",referencedColumnName = "id")
    private EmployeeEntity employee_id;

    @ManyToMany
    @JoinTable(name = "user_has_role",joinColumns=@JoinColumn(name="user_id"),inverseJoinColumns =@JoinColumn(name = "role_id"))
    private Set<RoleEntity> roles;
}
