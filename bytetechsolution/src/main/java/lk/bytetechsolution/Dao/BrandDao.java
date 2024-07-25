package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.BrandEntity;

public interface BrandDao extends JpaRepository<BrandEntity,Integer>{
    
}
