package com.example.reports;

import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportsSgmeApplication {

    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateReport() {
        try {
            // Cargar y compilar el archivo .jrxml
            ClassPathResource reportResource = new ClassPathResource("reports/reportelista.jrxml");
            JasperReport jasperReport = JasperCompileManager.compileReport(reportResource.getInputStream());

            // Parámetros del reporte
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("ReportTitle", "Reporte Lista");

            // Llenar el reporte con datos (puedes usar una conexión a base de datos aquí)
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());

            // Exportar el reporte a PDF
            byte[] pdfReport = JasperExportManager.exportReportToPdf(jasperPrint);

            // Configurar las cabeceras de la respuesta
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=reportelista.pdf");

            return new ResponseEntity<>(pdfReport, headers, HttpStatus.OK);
        } catch (JRException | IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}