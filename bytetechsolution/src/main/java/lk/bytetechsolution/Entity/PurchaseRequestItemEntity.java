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

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "purchase_request_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRequestItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "itemcode", unique = true)
    @NotNull
    private String itemcode;

    @Column(name = "itemname", unique = true)
    @NotNull
    private String itemname;

    @Column(name = "itemprice")
    @NotNull
    private BigDecimal itemprice;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

    @Column(name = "linetotal")
    @NotNull
    private BigDecimal linetotal;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private CategoryEntity category_id;


    @ManyToOne
    @JoinColumn(name = "purchase_request_id", referencedColumnName = "id")
    @JsonIgnore
    private PurchaseRequestEntity purchase_request_id;
}