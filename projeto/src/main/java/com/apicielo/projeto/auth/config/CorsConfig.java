package com.apicielo.projeto.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*"); // Permite todas as origens
        config.addAllowedHeader("*"); // Permite todos os headers
        config.addAllowedMethod("*"); // Permite todos os métodos (GET, POST, etc.)
        config.setAllowCredentials(true); // Permite o envio de credenciais (cookies, auth headers)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Aplica para todas as rotas

        return new CorsFilter(source);
    }
}
