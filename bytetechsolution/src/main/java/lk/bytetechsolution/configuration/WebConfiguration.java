package lk.bytetechsolution.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

     /*  @Bean
    public WebSecurityCustomizer webSecurityCustomizer(){
        return (web)-> web.ignoring()

        //spring security dhould completely ignore srting url with"/rcourcrs/..."

        .requestMatchers("/resources/**");
    }
 */

 @Bean
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
        .requestMatchers("/dashboard/**").hasAnyAuthority("Admin","Manager","User")
        //allow only for admin Manager
        .requestMatchers("/employee/**").hasAnyAuthority("Admin","Manager")
        //allow only for admin Manager
        .requestMatchers("/user/**").hasAnyAuthority("Admin","Manager")
        //allow only for admin Manager
        .requestMatchers("/privilage/**").hasAnyAuthority("Admin","Manager")
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
