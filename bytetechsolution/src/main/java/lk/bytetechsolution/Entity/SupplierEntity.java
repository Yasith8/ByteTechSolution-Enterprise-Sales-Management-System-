package lk.bytetechsolution.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String nic;
   
    @Column(name = "companyname")
    private String companyname;

    @Column(name = "companyphone")
    private String companyphone;
    
    supplierstatus_id int 
    @Column(name = "")
    private
    addedemployee_id int 
    @Column(name = "")
    private
    addeddatetime datetime
}@Column(name = "")
private
