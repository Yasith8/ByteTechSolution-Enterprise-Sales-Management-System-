/* package lk.bytetechsolution.email;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@EnableAsync
@Service
public class EmailServiceImplementation implements EmailService {

    // import java mail sender
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Async
    public void sendSimpleMail(EmailEntity email) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setFrom(sender);
        mailMessage.setTo(email.getSendto());
        mailMessage.setText(email.getMsgBody());
        mailMessage.setSubject(email.getSubject());

        javaMailSender.send(mailMessage);
    }

    // send emailwith attachment
    public void sendMailWithAttachment(EmailEntity email) throws MessagingException {
        // Creating a mime message
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        // Setting multipart as true for attachments to
        // be send
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
        mimeMessageHelper.setFrom(sender);
        mimeMessageHelper.setTo(email.getSendto());
        mimeMessageHelper.setText(email.getMsgBody(), true);
        mimeMessageHelper.setSubject(
                email.getSubject());

        // Adding the attachment
        FileSystemResource file = new FileSystemResource(
                new File(email.getAttachment()));

        mimeMessageHelper.addAttachment(
                file.getFilename(), file);

        // Sending the mail
        javaMailSender.send(mimeMessage);

    }

    

}
 */