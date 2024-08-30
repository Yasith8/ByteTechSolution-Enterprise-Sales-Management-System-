package lk.bytetechsolution.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.bytetechsolution.Entity.CpuGenerationEntity;



/* 
 * cpugenerationDao extended from jparepository
 * cpugenerationDao inherit all the methods provides by  JPARepository for CRUD operations on cpugenerationEntity
 * Integer spesify the type of primary key in cpugenerationEntity is Integer
 */
public interface CpuGenerationDao extends JpaRepository<CpuGenerationEntity,Integer> {

     @Query(value = "SELECT cg.* FROM bytetechsolution.cpugeneration cg where cg.id in (select shg.cpugeneration_id from bytetechsolution.cpusocket_has_cpugeneration shg where shg.cpusocket_id in (select cs.id from bytetechsolution.cpusocket cs where cs.name=?1))",nativeQuery = true)
    public List<CpuGenerationEntity> getGenBySocket(String socketname);
    
}
