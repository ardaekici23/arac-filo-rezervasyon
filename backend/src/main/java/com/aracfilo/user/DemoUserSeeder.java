package com.aracfilo.user;

import java.time.LocalDateTime;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Giriş ekranındaki "Demo hesaplar" ipucunun gerçek karşılığı olsun diye,
 * uygulama her başladığında (yoksa) iki demo hesabı oluşturur.
 */
@Component
public class DemoUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DemoUserSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        seedIfAbsent("Test User", "user@filorez.com", "123456", UserRole.KULLANICI);
        seedIfAbsent("Filo Yönetimi", "admin@filorez.com", "123456", UserRole.ADMIN);
    }

    private void seedIfAbsent(String ad, String eposta, String sifre, UserRole rol) {
        if (userRepository.findByEposta(eposta).isPresent()) {
            return;
        }
        userRepository.save(new User(ad, eposta, passwordEncoder.encode(sifre), rol, LocalDateTime.now()));
    }
}
