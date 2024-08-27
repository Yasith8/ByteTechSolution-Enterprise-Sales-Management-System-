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
@Table(name = "motherboardseries_has_motherboardtype")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MotherboardSeriesHasMotherboardTypeEntity {
    @Id
    @ManyToOne
    @JoinColumn(name="motherboardseries_id",referencedColumnName = "id")
    private MotherboardSeriesEntity motherboardseries_id;

    @Id
    @ManyToOne
    @JoinColumn(name="motherboardtype_id",referencedColumnName = "id")
    private MotherboardTypeEntity motherboardtype_id;

}
