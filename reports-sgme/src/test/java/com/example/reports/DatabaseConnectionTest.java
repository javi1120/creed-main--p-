package com.example.reports;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class DatabaseConnectionTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testConnection() {
        // Ejecuta una consulta simple para verificar la conexión
        String primerNombre = jdbcTemplate.queryForObject("SELECT primer_nombre FROM personas LIMIT 1", String.class);
        assertThat(primerNombre).isNotNull();
        System.out.println("Primer nombre: " + primerNombre);
    }
}