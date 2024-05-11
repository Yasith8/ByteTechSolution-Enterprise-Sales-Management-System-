package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.RoleEntity;
import java.util.List;

public interface RoleDao extends JpaRepository<RoleEntity,Integer>{
    
    @Query("select r from RoleEntity r where r.name <> 'Admin'")
    public List<RoleEntity> getListWithoutAdmin();
}
