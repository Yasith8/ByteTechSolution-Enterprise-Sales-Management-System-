package lk.bytetechsolution.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_has_role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserHasRoleEntity {
    
    @Id
    @ManyToOne
    @JoinColumn(name="user_id",referencedColumnName = "id")
    private UserEntity user_id;

    @Id
    @ManyToOne
    @JoinColumn(name="role_id",referencedColumnName = "id")
    private RoleEntity role_id;
}
