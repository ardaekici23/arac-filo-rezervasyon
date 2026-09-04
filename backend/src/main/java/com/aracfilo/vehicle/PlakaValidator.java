package com.aracfilo.vehicle;

import com.aracfilo.common.BusinessRuleException;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class PlakaValidator {

    private static final Pattern PLAKA_DESENI = Pattern.compile(
            "^(0[1-9]|[1-7][0-9]|8[01])"
                    + "([ABCDEFGHIJKLMNOPRSTUVYZ]\\d{4}"
                    + "|[ABCDEFGHIJKLMNOPRSTUVYZ]{2}\\d{3,4}"
                    + "|[ABCDEFGHIJKLMNOPRSTUVYZ]{3}\\d{2,3})$");

    private PlakaValidator() {
    }

    static String normalizeVeDogrula(String ham) {
        if (ham == null || ham.isBlank()) {
            throw new BusinessRuleException("Plaka boş olamaz");
        }

        String temizlenmis = ham
                .replace('ı', 'I')
                .replace('İ', 'I')
                .replace('i', 'I')
                .toUpperCase(Locale.ROOT)
                .replaceAll("[\\s-]+", "");

        Matcher eslesme = PLAKA_DESENI.matcher(temizlenmis);
        if (!eslesme.matches()) {
            throw new BusinessRuleException("Geçersiz plaka formatı");
        }

        String ilKodu = eslesme.group(1);
        String harfRakamGrubu = eslesme.group(2);
        Matcher harfRakamAyrimi = Pattern.compile("^([ABCDEFGHIJKLMNOPRSTUVYZ]+)(\\d+)$").matcher(harfRakamGrubu);
        harfRakamAyrimi.matches();
        String harfGrubu = harfRakamAyrimi.group(1);
        String rakamGrubu = harfRakamAyrimi.group(2);

        if (harfGrubu.startsWith("T")) {
            throw new BusinessRuleException("Taksi plakaları (T ile başlayan) şirket aracı olarak kaydedilemez");
        }

        return ilKodu + " " + harfGrubu + " " + rakamGrubu;
    }
}
