package com.apicielo.projeto.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendaDTO {

    @NotBlank(message = "A descrição não pode ser vazia.")
    @Size(max = 255, message = "A descrição não pode ter mais que 255 caracteres.")
    private String descricao;

    @NotNull(message = "O valor não pode ser nulo.")
    @Positive(message = "O valor deve ser maior que zero.")
    private Double valor;

    @NotBlank(message = "O número do cartão não pode ser vazio.")
    @Size(min = 16, max = 16, message = "O número do cartão deve ter 16 dígitos.")
    private String numeroCartao;

    @NotBlank(message = "A validade do cartão não pode ser vazia.")
    @Pattern(regexp = "^(0[1-9]|1[0-2])/([0-9]{4})$", message = "A validade do cartão deve estar no formato MM/YYYY.")
    private String validadeCartao;

    @NotBlank(message = "O código de segurança não pode ser vazio.")
    @Size(min = 3, max = 3, message = "O código de segurança deve ter 3 dígitos.")
    private String codigoSeguranca;

    private Integer status;

    private String paymentId;

    private String bandeiraCartao; // Novo campo para a bandeira do cartão

    private boolean cancelada;

}

