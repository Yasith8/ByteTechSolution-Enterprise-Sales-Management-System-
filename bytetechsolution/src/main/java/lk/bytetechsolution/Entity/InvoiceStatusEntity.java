package lk.bytetechsolution.Entity;
 

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoicestatus") // map the modularity table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//AllArgsConstructor annotation generates a constructor initializing all object fields.
@NoArgsConstructor//NoArgsConstructor generates a no-argument constructor for a class
public class InvoiceStatusEntity {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @NotNull
    @Column(name = "name")
    private String name;
}
