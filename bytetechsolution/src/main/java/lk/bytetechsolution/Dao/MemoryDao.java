package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.MemoryEntity;

public interface MemoryDao extends JpaRepository<MemoryEntity,Integer>{
    
}
