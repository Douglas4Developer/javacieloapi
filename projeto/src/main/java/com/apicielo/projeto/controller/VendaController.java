package com.apicielo.projeto.controller;

import com.apicielo.projeto.dto.VendaDTO;
import com.apicielo.projeto.service.OperacoesService;
import com.apicielo.projeto.service.VendaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
@Validated
@CrossOrigin(origins = "http://localhost:4200")
public class VendaController {

    private static final Logger logger = LoggerFactory.getLogger(VendaController.class);

    @Autowired
    private VendaService vendaService;

    @Autowired
    private OperacoesService operacoesService;

    @PostMapping
    public ResponseEntity<String> registrarVenda(@Valid @RequestBody VendaDTO vendaDTO) {
        logger.info("Recebida nova solicitação de venda para: {}", vendaDTO.getDescricao());
        String resultado = vendaService.processarVenda(vendaDTO);

        if ("Venda processada com sucesso.".equals(resultado)) {
            return ResponseEntity.ok(resultado);
        } else {
            logger.error("Erro ao processar a venda: {}", vendaDTO.getDescricao());
            return ResponseEntity.status(500).body("Erro ao processar a venda.");
        }
    }

    @GetMapping
    public ResponseEntity<List<VendaDTO>> listarVendas() {
        logger.info("Listando todas as vendas.");
        List<VendaDTO> vendas = vendaService.listarVendas();
        return ResponseEntity.ok(vendas);
    }


    @PutMapping("/cancelar/{paymentId}")
    public ResponseEntity<String> cancelarVenda(@PathVariable String paymentId) {
        try {
            ResponseEntity<String> response = operacoesService.cancelarVenda(paymentId);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao cancelar a venda: " + e.getMessage());
        }
    }

}
