package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.BrandEntity;
import java.util.*;

public interface BrandDao extends JpaRepository<BrandEntity,Integer>{
    
    @Query(value = "SELECT * FROM bytetechsolution.brand b where b.id in (select bhs.brand_id from bytetechsolution.brand_has_category bhs where bhs.category_id in (select c.id from bytetechsolution.category c where c.name=?1))",nativeQuery = true)
    public List<BrandEntity> getBrandByCategory(String categoryname);
}
