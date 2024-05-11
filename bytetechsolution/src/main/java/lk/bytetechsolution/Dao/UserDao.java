package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.UserEntity;

public interface UserDao extends JpaRepository<UserEntity,Integer>{   

}
