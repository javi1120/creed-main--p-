package com.example.reports;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/reports")
public class ReportsSgmeApplicationTest {

    private static final Logger logger = LoggerFactory.getLogger(ReportsSgmeApplication.class);

    @PostMapping("/generarpdf1")
    public ResponseEntity<byte[]> generateReport(@RequestBody Map<String, String> request) {
        String idArticulo = request.get("idArticulo");
        if (idArticulo == null || idArticulo.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

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
            byte[] pdfReport = JasperExportManager.exportReportToPdf(jasperPrint);

            // Configurar las cabeceras de la respuesta
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=reportelista.pdf");
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);

            return new ResponseEntity<>(pdfReport, headers, HttpStatus.OK);
        } catch (JRException | IOException e) {
            logger.error("Error al generar el reporte: ", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}