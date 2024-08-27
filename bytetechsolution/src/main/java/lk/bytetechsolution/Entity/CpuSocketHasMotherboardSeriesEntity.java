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
@Table(name = "cpusocket_has_motherboardseries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CpuSocketHasMotherboardSeriesEntity {
    @Id
    @ManyToOne
    @JoinColumn(name="cpusocket_id",referencedColumnName = "id")
    private CpuSocketEntity cpusocket_id;

    @Id
    @ManyToOne
    @JoinColumn(name="motherboardseries_id",referencedColumnName = "id")
    private MotherboardSeriesEntity motherboardseries_id;
}
