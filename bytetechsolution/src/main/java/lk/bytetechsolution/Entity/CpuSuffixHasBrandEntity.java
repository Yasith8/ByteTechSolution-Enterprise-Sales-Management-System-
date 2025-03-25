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
@Table(name = "cpusuffix_has_brand")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CpuSuffixHasBrandEntity {
    @Id
    @ManyToOne
    @JoinColumn(name="cpusuffix_id",referencedColumnName = "id")
    private CpuSuffixEntity cpusuffix_id;

    @Id
    @ManyToOne
    @JoinColumn(name="brand_id",referencedColumnName = "id")
    private BrandEntity brand_id;
}

