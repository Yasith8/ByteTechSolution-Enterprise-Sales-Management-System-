package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.MemoryTypeEntity;

public interface MemoryTypeDao extends JpaRepository<MemoryTypeEntity, Integer> {

    
}
