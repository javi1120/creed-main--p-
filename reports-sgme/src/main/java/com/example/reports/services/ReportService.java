package com.example.reports.services;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    public byte[] generarPdf(String idArticulo) {
        try {
            // Cargar y compilar el archivo .jrxml desde la nueva carpeta "jasper"
            ClassPathResource reportResource = new ClassPathResource("com/example/jasper/reportelista.jrxml");
            JasperReport jasperReport = JasperCompileManager.compileReport(reportResource.getInputStream());

            // Parámetros del reporte
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("ReportTitle", "Reporte Lista");
            parameters.put("idArticulo", idArticulo);

            // Fuente de datos
            Map<String, Object> data = new HashMap<>();
            data.put("sgmed3", "Valor de ejemplo");

            JRDataSource dataSource = new JRBeanCollectionDataSource(List.of(data));

            // Llenar el reporte con datos
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            // Exportar el reporte a PDF
            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (JRException | IOException e) {
            throw new RuntimeException("Error al generar el reporte: ", e);
        }
    }
}