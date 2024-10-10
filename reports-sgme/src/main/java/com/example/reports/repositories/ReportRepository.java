package com.example.reports.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.reports.models.Report;

@Repository
public class ReportRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate; // instancia jdbc template para traer datos de consulta

    public List<Report> obtenerDatos(int id, int id_articulos) {
        System.out.println("llego a la consulta");
        System.out.println(id);
        System.out.println(id_articulos);
        String sql = "SELECT nombre,referencia,estado,cantidad from sgme.articulos where id= 61";

        List<Report> result = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Report datos = new Report();
            // toma datos en model, desde funcion sql
           /*  datos.setNombre(rs.getString("nombre"));
            datos.setReferencia(rs.getString("referencia"));
            datos.setCantidad(rs.getString("cantidad"));
            datos.setEstado(rs.getBoolean("estado")); */
            return datos;
        });
        System.out.println("datos "+result);
        return result;
    }
}