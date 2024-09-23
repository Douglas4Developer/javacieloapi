package com.apicielo.projeto.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OperacoesService {
    @Value("${cielo.merchant.id}")
    private String merchantId;

    @Value("${cielo.merchant.key}")
    private String merchantKey;

    private final RestTemplate restTemplate;

    public OperacoesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> cancelarVenda(String paymentId) {
        String url = "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/" + paymentId + "/void";

        HttpHeaders headers = new HttpHeaders();
        headers.set("MerchantId", merchantId);
        headers.set("MerchantKey", merchantKey);

        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        try {
            return restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
        } catch (Exception e) {
            // Log a exceção e retorna um erro apropriado
            return ResponseEntity.status(500).body("Erro ao cancelar a venda: " + e.getMessage());
        }
    }

}
