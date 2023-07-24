package com.ssafy.tingbackend.security;

import com.ssafy.tingbackend.entity.user.User;
import com.ssafy.tingbackend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = (String) authentication.getCredentials();

        String encodePassword = passwordEncoder.encode(password);

        User user = userService.getUserInfo(email);

        if (!this.passwordEncoder.matches(encodePassword, user.getPassword())) {
            throw new BadCredentialsException("password is not matched");
        }

        return new UsernamePasswordAuthenticationToken(user, encodePassword, null);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
