package com.apicielo.projeto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoDTO {
    private String merchantOrderId;
    private double amount;
    private String softDescriptor;
    private Payment payment;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Payment {
        private String creditCardNumber;
        private String expirationDate;
        private String securityCode;
    }

    public PagamentoDTO(VendaDTO vendaDTO) {
        this.merchantOrderId = "123"; // Exemplo de order ID
        this.amount = vendaDTO.getValor();
        this.softDescriptor = vendaDTO.getDescricao();
        this.payment = new Payment(vendaDTO.getNumeroCartao(), vendaDTO.getValidadeCartao(), vendaDTO.getCodigoSeguranca());
    }
}
