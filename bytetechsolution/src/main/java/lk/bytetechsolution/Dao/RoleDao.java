package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.RoleEntity;
import java.util.List;

public interface RoleDao extends JpaRepository<RoleEntity,Integer>{
    
    @Query("select r from RoleEntity r where r.name <> 'Admin'")
    public List<RoleEntity> getListWithoutAdmin();

    @Query(value = "SELECT * FROM bytetechsolution.role as r where r.id in (select uhr.role_id from bytetechsolution.user_has_role as uhr where uhr.user_id in (select u.id from bytetechsolution.user as u where u.username=?1))",nativeQuery = true)
    public List<RoleEntity> getRolesByUserName(String username);
}
