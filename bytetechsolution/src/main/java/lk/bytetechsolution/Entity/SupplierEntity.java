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

import java.time.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "supplier")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private int id;

    @Column(name = "supplierid",unique = true)
    @NotNull
    private String supplierid;
     
    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "address")
    private String Address;

    @Column(name = "phone")
    @NotNull
    private String phone;

    @Column(name = "email")
    @NotNull
    private String email;
    
    @Column(name = "agentname")
    @NotNull
    private String agentname;
    
    @Column(name = "agentphone")
    @NotNull
    private String agentphone;

    
    @Column(name = "agentemail")
    @NotNull
    private String agentemail;

    @Column(name = "branchname")
    @NotNull
    private String branchname;

    @Column(name = "accountname")
    @NotNull
    private String accountname;

    @Column(name = "accountno")
    @NotNull
    private int accountno;

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
    @JoinColumn(name="bankname_id",referencedColumnName = "id")
    private BankNameEntity bankname_id;

    @ManyToOne
    @JoinColumn(name="supplierstatus_id",referencedColumnName = "id")
    private SupplierStatusEntity supplierstatus_id;
    
    @OneToMany(mappedBy = "supplier_id")
    @JsonIgnore //block the recursion
    private List<SupplierHasBrandCategoryEntity> supplier_has_brand_category;

}
