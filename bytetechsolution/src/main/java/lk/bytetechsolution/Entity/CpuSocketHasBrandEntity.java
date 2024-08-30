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
@Table(name = "cpusocket_has_brand")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CpuSocketHasBrandEntity {
    @Id
    @ManyToOne
    @JoinColumn(name="cpusocket_id",referencedColumnName = "id")
    private CpuSocketEntity cpusocket_id;

    @Id
    @ManyToOne
    @JoinColumn(name="brand_id",referencedColumnName = "id")
    private BrandEntity brand_id;
}
