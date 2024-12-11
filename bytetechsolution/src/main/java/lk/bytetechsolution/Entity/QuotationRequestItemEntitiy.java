package lk.bytetechsolution.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

@Entity//class convert into entity. in here java tell to system instance of this class represent rows in table in db
@Table(name = "quotation_request_item")//assign the table to the entity class. here map to the table
@Data// this data use to genarate getters and setters and toString to this class
@NoArgsConstructor//AllArgsConstructor annotation generates a constructor initializing all object fields.
@AllArgsConstructor//NoArgsConstructor generates a no-argument constructor for a class
public class QuotationRequestItemEntitiy
 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //set Auto Increment
    @Column(name = "id",unique = true)
    private int id;

    @NotNull
    @Column(name = "itemcode")
    private String itemcode;

    @NotNull
    @Column(name = "itemname")
    private String itemname;

    @ManyToOne
    @JoinColumn(name = "quotation_request_id",referencedColumnName = "id")
    @JsonIgnore
    private QuotationRequestEntity quotation_request_id;
}
