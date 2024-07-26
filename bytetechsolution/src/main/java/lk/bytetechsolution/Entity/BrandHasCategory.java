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
@Table(name = "brand_has_catgory")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrandHasCategory {
    
    @Id
    @ManyToOne
    @JoinColumn(name = "category_id",referencedColumnName = "id")
    private CategoryEntity category_id;
    
    @Id
    @ManyToOne
    @JoinColumn(name = "brand_id",referencedColumnName = "id")
    private BrandEntity brand_id;
}
