package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.bytetechsolution.Entity.BankNameEntity;

public interface BankNameDao extends JpaRepository<BankNameEntity,Integer>{
    
}
