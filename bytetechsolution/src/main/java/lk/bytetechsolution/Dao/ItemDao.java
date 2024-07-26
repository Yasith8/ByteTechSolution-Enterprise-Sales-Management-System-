package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.ItemEntity;

public interface ItemDao extends JpaRepository<ItemEntity,Integer>{
    
}
