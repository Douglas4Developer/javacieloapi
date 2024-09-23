package com.apicielo.projeto.service;

import com.apicielo.projeto.dto.VendaDTO;
import com.apicielo.projeto.entities.Venda;
import com.apicielo.projeto.repository.VendaRepository;
import com.apicielo.projeto.utils.EncryptionService;
import org.jasypt.encryption.StringEncryptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VendaService {
    @Autowired
    private EncryptionService encryptor;
    private static final Logger logger = LoggerFactory.getLogger(VendaService.class);

    @Value("${cielo.merchant.id}")
    private String merchantId;

    @Value("${cielo.merchant.key}")
    private String merchantKey;

    private final RestTemplate restTemplate;gi
    private final VendaRepository vendaRepository;
    private final ObjectMapper objectMapper;

    private final EncryptionService encryptionService;

    public VendaService(RestTemplate restTemplate, VendaRepository vendaRepository, EncryptionService encryptionService) {
        this.restTemplate = restTemplate;
        this.vendaRepository = vendaRepository;
        this.encryptionService = encryptionService;
        this.objectMapper = new ObjectMapper();
    }

    public String processarVenda(VendaDTO vendaDTO) {
        // Converte o DTO para a entidade
        Venda venda = converterParaEntidade(vendaDTO);

        // Realiza o pagamento na Cielo
        Map<String, Object> respostaPagamento = realizarPagamento(vendaDTO);

        if (respostaPagamento != null && "SUCCESS".equals(respostaPagamento.get("status"))) {
            //Criptografando os numeros do cartao e codigo de segurança

            String encryptedCardNumber = encryptionService.encrypt(venda.getNumeroCartao());
            venda.setNumeroCartao(encryptedCardNumber);

            String encryptedCodSecurity = encryptionService.encrypt(venda.getCodigoSeguranca());
            venda.setCodigoSeguranca(encryptedCodSecurity);

            int statusTransacional = (int) respostaPagamento.get("statusCode"); // Pega o status da resposta
            venda.setStatus(statusTransacional); // Salva o status na entidade

            vendaRepository.save(venda);
            logger.info("Venda processada e salva com sucesso: {}", venda.getDescricao());
            return "Venda processada com sucesso.";
        } else {
            logger.warn("Erro ao processar a venda: {}", respostaPagamento);
            return "Falha ao processar a venda.";
        }
    }

    private Venda converterParaEntidade(VendaDTO vendaDTO) {
        Venda venda = new Venda();
        venda.setDescricao(vendaDTO.getDescricao());
        venda.setValor(vendaDTO.getValor());
        venda.setNumeroCartao(vendaDTO.getNumeroCartao());
        venda.setValidadeCartao(vendaDTO.getValidadeCartao());
        venda.setCodigoSeguranca(vendaDTO.getCodigoSeguranca());
        return venda;
    }

    private Map<String, Object> realizarPagamento(VendaDTO vendaDTO) {
        String url = "https://apisandbox.cieloecommerce.cielo.com.br/1/sales";
        logger.info("Iniciando processamento de pagamento para: {}", vendaDTO.getDescricao());

        HttpHeaders headers = criarHeaders();
        Map<String, Object> corpoPagamento = criarCorpoPagamento(vendaDTO);

        String corpoJson;
        try {
            corpoJson = objectMapper.writeValueAsString(corpoPagamento);
            logger.debug("Corpo da requisição de pagamento: {}", corpoJson);
        } catch (JsonProcessingException e) {
            logger.error("Erro ao converter o corpo do pagamento para JSON.", e);
            return null;
        }

        HttpEntity<String> requestEntity = new HttpEntity<>(corpoJson, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.CREATED) {
                logger.info("Pagamento aprovado para venda: {}", vendaDTO.getDescricao());

                Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
                Map<String, Object> paymentDetails = (Map<String, Object>) responseBody.get("Payment");

                int statusTransacional = (Integer) paymentDetails.get("Status"); // Pega o status do pagamento
                responseBody.put("statusCode", statusTransacional);
                responseBody.put("status", "SUCCESS");

                return responseBody;
            }else {
                logger.warn("Falha ao processar pagamento. Status: {}", response.getStatusCode());
                return null;
            }
        } catch (HttpClientErrorException e) {
            logger.error("Erro HTTP: Status Code: {}, Corpo: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            logger.error("Erro durante a comunicação com a API da Cielo.", e);
            return null;
        }
    }

    private HttpHeaders criarHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("MerchantId", merchantId);
        headers.set("MerchantKey", merchantKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        return headers;
    }

    private Map<String, Object> criarCorpoPagamento(VendaDTO vendaDTO) {
        Map<String, Object> payment = new HashMap<>();
        payment.put("Type", "CreditCard");
        payment.put("Amount", (int) (vendaDTO.getValor() * 100)); // Valor em centavos
        payment.put("Installments", 1);

        Map<String, String> creditCard = new HashMap<>();
        creditCard.put("CardNumber", vendaDTO.getNumeroCartao());
        creditCard.put("Holder", "Nome do Titular");
        creditCard.put("ExpirationDate", vendaDTO.getValidadeCartao());
        creditCard.put("SecurityCode", vendaDTO.getCodigoSeguranca());
        creditCard.put("Brand", "Visa"); // Ajuste conforme a bandeira do cartão

        payment.put("CreditCard", creditCard);

        Map<String, Object> body = new HashMap<>();
        body.put("MerchantOrderId", "123456"); // ID único da transação
        body.put("Payment", payment);

        return body;
    }

    public List<VendaDTO> listarVendas() {
        List<Venda> vendas = vendaRepository.findAll();

        return vendas.stream().map(venda -> {
            VendaDTO vendaDTO = new VendaDTO();
            vendaDTO.setDescricao(venda.getDescricao());
            vendaDTO.setValor(venda.getValor());
            vendaDTO.setStatus(venda.getStatus());

            // Decrypting the card number
            String decryptedCardNumber = encryptor.decrypt(venda.getNumeroCartao());
            // Mask the card number (show last 4 digits only)
            String maskedCardNumber = "**** **** **** " + decryptedCardNumber.substring(decryptedCardNumber.length() - 4);
            vendaDTO.setNumeroCartao(maskedCardNumber);

            return vendaDTO;
        }).collect(Collectors.toList());
    }
}