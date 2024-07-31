package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.ItemStatusEntity;

public interface ItemStatusDao extends JpaRepository<ItemStatusEntity,Integer> {

    
} 
