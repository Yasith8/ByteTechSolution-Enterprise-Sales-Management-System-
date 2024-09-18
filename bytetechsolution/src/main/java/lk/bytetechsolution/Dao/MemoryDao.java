package lk.bytetechsolution.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.MemoryEntity;

public interface MemoryDao extends JpaRepository<MemoryEntity, Integer> {

    @Query(value = "select m from MemoryEntity m where m.itemname=?1")
    public MemoryEntity getByMemoryName(String itemname);

    @Query(value = "select concat('MEM',lpad(substring(max(mem.itemcode),4)+1,4,'0')) as itemcode from bytetechsolution.memory as mem",nativeQuery = true)
    public String getNextMemNumber();

}
