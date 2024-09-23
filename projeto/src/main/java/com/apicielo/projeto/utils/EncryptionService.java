package com.apicielo.projeto.utils;

import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.stereotype.Service;

@Service
public class EncryptionService {
    private final BasicTextEncryptor textEncryptor;

    public EncryptionService() {
        textEncryptor = new BasicTextEncryptor();
        textEncryptor.setPassword("#123456#");
    }

    public String encrypt(String input) {
        return textEncryptor.encrypt(input);
    }

    public String decrypt(String encryptedInput) {
        return textEncryptor.decrypt(encryptedInput);
    }
}
