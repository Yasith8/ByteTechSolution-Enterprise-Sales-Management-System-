package lk.bytetechsolution.Entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "supplier_has_brand_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierHasBrandCategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private int id;

    @ManyToOne
    @JoinColumn(name="supplier_id",referencedColumnName = "id")
    private SupplierEntity supplier_id;

    @ManyToOne
    @JoinColumn(name="brand_id",referencedColumnName = "id")
    private BrandEntity brand_id;
    
    @ManyToOne
    @JoinColumn(name="category_id",referencedColumnName = "id")
    private CategoryEntity category_id;
}
