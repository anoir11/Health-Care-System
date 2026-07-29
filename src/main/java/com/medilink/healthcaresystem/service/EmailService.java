package com.medilink.healthcaresystem.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // public void sendVerificationCode(String toEmail, String code) {
    //     SimpleMailMessage message = new SimpleMailMessage();
    //     message.setTo(toEmail);
    //     message.setSubject("MediLink - Verify your email");
    //     message.setText("Your verification code is: " + code +
    //             "\n\nThis code expires in 15 minutes.");
    //     mailSender.send(message);
    // }

    public void sendVerificationCode(String toEmail, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Verify your MediLink account");
            helper.setText(buildVerificationEmailHtml(code), true); // true = isHtml

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }

    private String buildVerificationEmailHtml(String code) {
        return """
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; background-color:#f1f5f9; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
          <table width="100%%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #e53e3e, #c53030); padding: 32px 40px; text-align:center;">
                      <div style="display:inline-flex; align-items:center; gap:8px;">
                        <span style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.5px;">MediLink</span>
                      </div>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 40px 24px 40px;">
                      <h1 style="margin:0 0 8px 0; font-size:20px; color:#111827; font-weight:700;">Verify your email</h1>
                      <p style="margin:0 0 28px 0; font-size:14px; color:#6b7280; line-height:1.6;">
                        Enter this code in the app to finish creating your account. It expires in 15 minutes.
                      </p>

                      <!-- Code box -->
                      <div style="background:#f8fafc; border:1.5px dashed #e2e8f0; border-radius:12px; padding:20px; text-align:center; margin-bottom:28px;">
                        <span style="font-size:32px; font-weight:800; letter-spacing:8px; color:#e53e3e;">%s</span>
                      </div>

                      <p style="margin:0; font-size:13px; color:#9ca3af; line-height:1.6;">
                        Didn't request this? You can safely ignore this email — no account will be created.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px; background:#f8fafc; text-align:center;">
                      <p style="margin:0; font-size:12px; color:#9ca3af;">© 2026 MediLink · Tunisia</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """.formatted(code);
    }
}
