package lk.bytetechsolution.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/* 
 * ------------Entity-----------
 * convert into entity class
 * Entity from JPA-Java Persistence API(also known as jakarta persistence api)
 * Entity used to mark class as a entity
 * java tell system to instance of this class will represent rows in db's table
 */
@Entity
@Table(name = "gpuchipset_has_gpuseries") // map the gpuchipset table
@Data//genarate getters and setters and toString to class
@AllArgsConstructor//default constructor       ----usefull when create object that not have any initial values
@NoArgsConstructor//all argument constructor  ----usefull when create object that have any initial values
public class GpuChipsetHasGpuSeriesEntity {
     @Id
    @ManyToOne
    @JoinColumn(name="gpuchipset_id",referencedColumnName = "id")
    private GpuChipsetEntity gpuchipset_id;

    @Id
    @ManyToOne
    @JoinColumn(name="gpuseries_id",referencedColumnName = "id")
    private GpuSeriesEntity gpuseries_id;
}
