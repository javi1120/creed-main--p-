package com.example.reports.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.reports.services.ReportService;

import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private static final Logger logger = Logger.getLogger(ReportsController.class.getName());

    @Autowired
    private ReportService reportService;

    @PostMapping("/generarpdf")
    public ResponseEntity<byte[]> generarpdf(@RequestBody Map<String, String> params) {
        logger.info("Datos recibidos: " + params); // Log de los datos recibidos
        String idArticulo = params.get("idArticulo");
        if (idArticulo == null) {
            logger.warning("idArticulo es nulo");
            return ResponseEntity.badRequest().body(null);
        }
        
        byte[] pdfReport = reportService.generarPdf(idArticulo);
        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=reporte.pdf")
                .body(pdfReport);
    }
}