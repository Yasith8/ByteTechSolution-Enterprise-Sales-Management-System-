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

import java.time.*;

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
    
    @Column(name = "nic")
    @NotNull
    private String nic;
    
    @Column(name = "agentname")
    @NotNull
    private String agentname;
    
    @Column(name = "agentphone")
    @NotNull
    private String agentphone;

    
    @Column(name = "agentemail")
    @NotNull
    private String agentemail;

    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;
    
    @ManyToOne
    @JoinColumn(name="supplierstatus_id",referencedColumnName = "id")
    private SupplierStatusEntity supplierstatus_id;

    @ManyToOne
    @JoinColumn(name="addedemployee_id",referencedColumnName = "id")
    private EmployeeEntity addedemployee_id;

}
