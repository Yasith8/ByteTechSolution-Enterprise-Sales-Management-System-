package lk.bytetechsolution.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity//class convert into entity. in here java tell to system instance of this class represent rows in table in db
@Table(name = "quotation_request_has_supplier")//assign the table to the entity class. here map to the table
@Data// this data use to genarate getters and setters and toString to this class
@NoArgsConstructor//AllArgsConstructor annotation generates a constructor initializing all object fields.
@AllArgsConstructor//NoArgsConstructor generates a no-argument constructor for a class
public class QuotationRequestHasSupplierEntity {
    @Id
    @ManyToOne
    @JoinColumn(name="quotation_request_id;",referencedColumnName = "id")
    private QuotationRequestEntity quotation_request_id;

    @Id
    @ManyToOne
    @JoinColumn(name="supplier_id;",referencedColumnName = "id")
    private SupplierEntity supplier_id;
}
