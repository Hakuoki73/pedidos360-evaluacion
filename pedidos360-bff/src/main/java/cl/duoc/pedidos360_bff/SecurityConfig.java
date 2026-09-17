package cl.duoc.pedidos360_bff;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Habilitamos CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 2. Desactivamos CSRF (no requerido para APIs REST basadas en tokens)
            .csrf(csrf -> csrf.disable())
            // 3. REGLA ESTRICTA DE LA RÚBRICA: Exigimos autenticación obligatoria para cualquier endpoint
            .authorizeHttpRequests(authz -> authz
                .anyRequest().authenticated()
            )
            // 4. Activamos la seguridad OAuth2 Resource Server para validar el JWT
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder()))
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Apuntamos al endpoint oficial de llaves públicas JWK de tu Azure CIAM
        String jwkSetUri = "https://pedido360seba2026.ciamlogin.com/39eb9615-c754-4ef1-96f8-4f61494df782/discovery/v2.0/keys";
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}