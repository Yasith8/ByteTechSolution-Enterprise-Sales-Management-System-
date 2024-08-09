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
@Table(name = "itemhassupplier")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemHasSupplierEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true)
    private int id;

     @Id
    @ManyToOne
    @JoinColumn(name = "item_id",referencedColumnName = "id")
    private ItemEntity item_id;
    
    @Id
    @ManyToOne
    @JoinColumn(name = "supplier_id",referencedColumnName = "id")
    private SupplierEntity supplier_id;
}
