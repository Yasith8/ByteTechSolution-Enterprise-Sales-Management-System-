package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.CategoryEntity;

public interface CategoryDao extends JpaRepository<CategoryEntity,Integer> {
    
}
