package lk.bytetechsolution.service;

import java.util.ArrayList;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.RoleEntity;
import lk.bytetechsolution.Entity.UserEntity;


/* 
 * SERVICE ANNOTATION
 * service used to define class as a service(service provider)
 * so it will be automatically detect by spring context when component scanning
 * 
 * MYUSERSERVICEDETAILS ANNOTATION
 * this implements userDetailsService interface
 * this indicate user-specific data during authentication
 */

@Service
public class MyUserServiceDetails implements UserDetailsService {
    

    @Autowired
    private UserDao dao;

    /* 
     * Override Annotation
     *   - indicate method overiding a method from a superclass or interface
     * 
     *  Transactional Annotation
     *   - this used to mark transactional boundries
     *   - ensure method run within transaction
     *  
     */

    @Override
    @Transactional

    /* 
     * provide from UserDetailService
     * this load user-specific data based on username during authentication process
     * if cant load username it throw usernamenotfound exeption
     */
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{

        UserEntity loggedUser=dao.getByUsername(username);

        System.out.println(loggedUser.getUsername());

        ArrayList<GrantedAuthority> authorities=new ArrayList<>();
        for(RoleEntity role:loggedUser.getRoles()){
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        return new User(loggedUser.getUsername(), loggedUser.getPassword(), loggedUser.getStatus(),true,true,true,authorities);
    }

}
