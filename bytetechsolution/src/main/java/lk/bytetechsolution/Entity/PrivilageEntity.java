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

@Entity
@Table(name = "privilage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrivilageEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private Integer id;

    @Column(name="insprv")
    @NotNull
    private Boolean insprv;

    @Column(name="selprv")
    @NotNull
    private Boolean selprv;

    @Column(name="delprv")
    @NotNull
    private Boolean delprv;

    @Column(name="updprv")
    @NotNull
    private Boolean updprv;

    @ManyToOne
    @JoinColumn(name="role_id",referencedColumnName = "id")
    private RoleEntity role_id;

    @ManyToOne
    @JoinColumn(name="module_id",referencedColumnName = "id")
    private ModuleEntity module_id;

}
