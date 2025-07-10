package lk.bytetechsolution.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoggedUserEntity {
    private String username;
    private String oldusername;
    private String newpassword;
    private String oldpassword;
    private String email;
    private byte[] photo;
}
