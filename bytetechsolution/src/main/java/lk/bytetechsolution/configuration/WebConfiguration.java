package lk.bytetechsolution.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration  //allowing to define beans
@EnableWebSecurity //enable spring web security support and provide spring mvc intergration
public class WebConfiguration {

     /*  @Bean
    public WebSecurityCustomizer webSecurityCustomizer(){
        return (web)-> web.ignoring()

        //spring security dhould completely ignore srting url with"/rcourcrs/..."

        .requestMatchers("/resources/**");
    }
 */

 @Bean //used for indicate that method produce a bean to be managed by spring container
 //securityfilterchain allow customization of the httpsecurity object
 //filterchain defineSecurityFilterChain bean, which do security filters for http requests
 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
    http
    //request Filters
    .authorizeHttpRequests((request)->{
        //allow all request to access
        request.requestMatchers("/createadmin").permitAll()
        //allow all request to access
        .requestMatchers("/login").permitAll()
        //allow all request to access
        .requestMatchers("/resources/**").permitAll()
        //allow only for admin Manager and user to dash  board
        .requestMatchers("/dashboard/**").hasAnyAuthority("Admin","Manager","Store Manager","Assistant Manager","Store Assistant","Cashier")
        //allow only for admin Manager
        .requestMatchers("/employee/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        //allow only for admin Manager
        .requestMatchers("/user/**").hasAnyAuthority("Admin","Manager")
        //allow only for admin Manager
        .requestMatchers("/privilage/**").hasAnyAuthority("Admin","Manager")
        .requestMatchers("/supplier/**").hasAnyAuthority("Admin","Manager")
        
        //allow for items
        .requestMatchers("/processor/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/motherboard/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/gpu/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/memory/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/storage/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/cooler/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/powersupply/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/casing/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/monitor/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/monitor/**").hasAnyAuthority("Admin","Manager","Assistant Manager")
        .requestMatchers("/accessories/**").hasAnyAuthority("Admin","Manager","Assistant Manager")

        .requestMatchers("/inventory/**").hasAnyAuthority("Admin","Manager","Store Manager")
        .requestMatchers("/report/**").hasAnyAuthority("Admin","Manager")
        
        //allow for supplier portal
        .requestMatchers("/supplier/**").hasAnyAuthority("Admin","Manager","Assistant Manager") 
        .requestMatchers("/quotationrequest/**").hasAnyAuthority("Admin","Manager","Store Manager","Store Assistant") 
        .requestMatchers("/supplierquotation/**").hasAnyAuthority("Admin","Manager","Store Manager","Store Assistant") 
        .requestMatchers("/purchaserequest/**").hasAnyAuthority("Admin","Manager","Store Manager") 
        .requestMatchers("/grn/**").hasAnyAuthority("Admin","Manager","Store Manager","Store Assistant") 
        .requestMatchers("/supplierpayment/**").hasAnyAuthority("Admin","Manager") 
        .requestMatchers("/suppliersubmitquotation/**").permitAll()
        .requestMatchers("/quotationrequestsubmit/**").permitAll()
        .requestMatchers("/suppliersubmit/**").permitAll()

        //allow for the  customer and sales portal
        .requestMatchers("/customer/**").hasAnyAuthority("Admin","Manager","Cashier","Assistant Manager") 
        .requestMatchers("/order/**").hasAnyAuthority("Admin","Manager","Cashier","Assistant Manager") 
        .requestMatchers("/preorder/**").hasAnyAuthority("Admin","Manager","Cashier","Assistant Manager") 
        .requestMatchers("/invoice/**").hasAnyAuthority("Admin","Manager","Cashier","Assistant Manager") 
        .requestMatchers("/customerpayment/**").hasAnyAuthority("Admin","Manager","Cashier","Assistant Manager") 
        .anyRequest().authenticated();// any other requst need authenticate
        
        
        
    })

    //login filter
    .formLogin((login)->{
        login.loginPage("/login")
        .usernameParameter("username")
        .passwordParameter("password")
        .defaultSuccessUrl("/dashboard",true)
        .failureUrl("/login?error=invalidusernamepassword");
    })

    //logout filter
    .logout((logout)->{
        logout.logoutUrl("/logout")
        .logoutSuccessUrl("/login");
    })

    //crosssite scripting filter
    .csrf((csrf)->{
        csrf.disable();
    })

    .exceptionHandling((exception)->{
        exception.accessDeniedPage("/errorpage");
    });

    return http.build();
 }

 @Bean
 public BCryptPasswordEncoder bCryptPasswordEncoder(){
    return new BCryptPasswordEncoder();
 }
    
}
