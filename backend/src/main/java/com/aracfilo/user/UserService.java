package com.aracfilo.user;

import com.aracfilo.common.BusinessRuleException;
import com.aracfilo.common.NotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> listAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Kullanıcı bulunamadı: " + id));
    }

    public User register(String ad, String eposta, String sifre, UserRole rol) {
        String normalizeEposta = eposta.trim().toLowerCase();
        if (userRepository.findByEposta(normalizeEposta).isPresent()) {
            throw new BusinessRuleException("Bu e-posta zaten kayıtlı");
        }
        User user = new User(ad.trim(), normalizeEposta, passwordEncoder.encode(sifre), rol, LocalDateTime.now());
        return userRepository.save(user);
    }

    public User login(String eposta, String sifre) {
        User user = userRepository.findByEposta(eposta.trim().toLowerCase())
                .orElseThrow(() -> new BusinessRuleException("Bu e-posta ile kayıt bulunamadı"));
        if (!passwordEncoder.matches(sifre, user.getSifreHash())) {
            throw new BusinessRuleException("Şifre hatalı");
        }
        return user;
    }

    public User update(Long id, String ad, String eposta, UserRole rol) {
        User existing = findById(id);
        existing.setAd(ad);
        existing.setEposta(eposta);
        existing.setRol(rol);
        return userRepository.save(existing);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
