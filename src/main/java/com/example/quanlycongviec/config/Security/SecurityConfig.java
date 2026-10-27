package com.example.quanlycongviec.config.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.quanlycongviec.Service.UserDetailServiceCustomize;
import com.example.quanlycongviec.config.CustomAuthenticationSuccessHandler;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailServiceCustomize userDetail;
    private final JwtDecoderConfig jwtDecoderConfig;
    private final CustomAuthenticationSuccessHandler customSuccessHandler;
    private final AuthFillter authFillter;
    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetail);
        authenticationProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        authorize -> authorize
                                .requestMatchers("/", "/css/**",
                                        "/js/**",
                                        "/images/**",
                                        "/webjars/**",
                                        "/favicon.ico",
                                        "/api/user/create",
                                        "/login",
                                        "/api/auth/login")
                                .permitAll()
                                .anyRequest().authenticated())
                .oauth2ResourceServer((oath2) -> oath2.jwt(jwtConfig -> jwtConfig.decoder(jwtDecoderConfig)))
                 .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.NEVER))
                 .addFilterBefore(authFillter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.loginPage("/login")
                        .successHandler(customSuccessHandler)
                        .permitAll());
        return http.build();
    }


    // // 1. Chain dành riêng cho các API (REST / JWT)
    // @Bean
    // @Order(1)
    // public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
    //     http
    //         .securityMatcher("/api/**")
    //         .csrf(AbstractHttpConfigurer::disable)
    //         .authorizeHttpRequests(auth -> auth
    //             .requestMatchers("/api/user/create", "/api/auth/login", "/api/login").permitAll()
    //             .anyRequest().authenticated()
    //         )
    //         .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoderConfig)));

    //     return http.build();
    // }

    // // 2. Chain dành cho Web Giao diện (Thymeleaf / Form Login)
    // @Bean
    // @Order(2)
    // public SecurityFilterChain webFilterChain(HttpSecurity http) throws Exception {
    //     http
    //         .csrf(AbstractHttpConfigurer::disable)
    //         .authorizeHttpRequests(auth -> auth
    //             .requestMatchers("/", "/login", "/css/**", "/js/**", "/images/**", "/webjars/**", "/favicon.ico").permitAll()
    //             .anyRequest().authenticated()
    //         )
    //         .formLogin(form -> form
    //             .loginPage("/login")
    //             .successHandler(customSuccessHandler)
    //             .permitAll()
    //         );

    //     return http.build();
    // }


}
