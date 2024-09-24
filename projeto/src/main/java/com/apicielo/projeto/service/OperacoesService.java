package com.apicielo.projeto.service;


import com.apicielo.projeto.entities.Venda;
import com.apicielo.projeto.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OperacoesService {

    @Value("${cielo.merchant.id}")
    private String merchantId;

    @Value("${cielo.merchant.key}")
    private String merchantKey;
    private final VendaRepository vendaRepository;  // Adicione o repositório aqui
    private final RestTemplate restTemplate;
    private final VendaService vendaService;

    public OperacoesService(VendaRepository vendaRepository, RestTemplate restTemplate, VendaService vendaService) {
        this.vendaRepository = vendaRepository;
        this.restTemplate = restTemplate;
        this.vendaService = vendaService;
    }

    public ResponseEntity<String> cancelarVenda(String paymentId) {
        String url = "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/" + paymentId + "/void";

        HttpHeaders headers = new HttpHeaders();
        headers.set("MerchantId", merchantId);
        headers.set("MerchantKey", merchantKey);

        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.PUT, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();

            // Verifica se o status do cancelamento foi bem-sucedido (Status == 10)
            if (responseBody != null && (int) responseBody.get("Status") == 10) {
                String returnCode = (String) responseBody.get("ReturnCode");
                if ("0".equals(returnCode)) {
                    // Atualize a venda no banco de dados
                    Venda venda = vendaRepository.findByPaymentId(paymentId);
                    if (venda != null) {
                        venda.setCancelada(true);  // Campo novo "cancelada" como true
                        vendaRepository.save(venda);
                    }
                    return ResponseEntity.ok("Venda cancelada com sucesso.");
                }
            }

            return ResponseEntity.status(response.getStatusCode()).body("Erro ao cancelar a venda.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao cancelar a venda: " + e.getMessage());
        }
    }
}
