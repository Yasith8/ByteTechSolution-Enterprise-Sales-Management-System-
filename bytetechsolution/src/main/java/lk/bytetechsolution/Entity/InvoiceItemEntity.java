package lk.bytetechsolution.Entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "invoice_item") // map the modularity table
@Data // genarate getters and setters and toString to class
@AllArgsConstructor // AllArgsConstructor annotation generates a constructor initializing all object
@NoArgsConstructor // NoArgsConstructor generates a no-argument constructor for a class
public class InvoiceItemEntity {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // set Auto Increment
    @Column(name = "id", unique = true)
    private int id;

    @NotNull
    @Column(name = "itemcode")
    private String itemcode;

    @NotNull
    @Column(name = "itemname")
    private String itemname;
    
    @Column(name = "serial_no")
    private String serial_no;
    
    @NotNull
    @Column(name = "itemprice")
    private BigDecimal itemprice;

    @Column(name = "quantity")
    @NotNull
    private int quantity;

    @Column(name = "lineprice")
    @NotNull
    private BigDecimal lineprice;


    @Column(name = "warranty")
    private Integer warranty;

    @ManyToOne
    @JoinColumn(name = "category_id",referencedColumnName = "id")
    private CategoryEntity category_id;

    @ManyToOne
    @JoinColumn(name = "invoice_id",referencedColumnName = "id")
    @JsonIgnore
    private InvoiceEntity invoice_id;

}
